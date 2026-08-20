import os
import json
import base64
import tempfile
from pathlib import Path
from typing import Optional

import requests


GITHUB_API_VERSION = "2022-11-28"
GITHUB_API_BASE = "https://api.github.com"

CONFIG_PATH = Path("data/home-cardslider-config.json")
LEDGER_PATH = Path("data/expen-trac-data.json")

REQUEST_TIMEOUT = 30
MAX_RETRIES = 3

PRESET_META = {
    "blog": "部落格",
    "tol": "工具庫",
    "music": "音樂頻道",
    "shorts": "Shorts",
    "wiki": "支援中心",
    "setting": "設定",
    "Expen-Trac": "LINE 記帳",
}


def create_github_session(token: str) -> requests.Session:
    """
    建立 GitHub API Session。

    使用傳入的 MSK 作為 GitHub API 授權。
    不在 log 中輸出 token 本身。
    """
    session = requests.Session()

    session.headers.update(
        {
            "Authorization": f"Bearer {token}",
            "Accept": "application/vnd.github+json",
            "X-GitHub-Api-Version": GITHUB_API_VERSION,
            "User-Agent": "Mobsp-KYTK-Automated-Sync",
        }
    )

    return session


def request_with_retry(
    session: requests.Session,
    method: str,
    url: str,
    **kwargs,
) -> requests.Response:
    """
    對暫時性網路 / GitHub API 錯誤進行有限次數 retry。

    Retry：
    - 429
    - 500
    - 502
    - 503
    - 504

    同時處理 requests 網路例外。
    """
    last_exception = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = session.request(
                method,
                url,
                timeout=REQUEST_TIMEOUT,
                **kwargs,
            )

            if response.status_code not in {
                429,
                500,
                502,
                503,
                504,
            }:
                return response

            print(
                f"⚠️ GitHub API 暫時性錯誤 "
                f"(HTTP {response.status_code})，"
                f"第 {attempt}/{MAX_RETRIES} 次嘗試。"
            )

            if attempt < MAX_RETRIES:
                wait_seconds = 2 ** (attempt - 1)
                import time

                time.sleep(wait_seconds)

        except requests.RequestException as exc:
            last_exception = exc

            print(
                f"⚠️ GitHub API 網路請求失敗，"
                f"第 {attempt}/{MAX_RETRIES} 次嘗試：{exc}"
            )

            if attempt < MAX_RETRIES:
                wait_seconds = 2 ** (attempt - 1)
                import time

                time.sleep(wait_seconds)

    if last_exception is not None:
        raise RuntimeError(
            f"GitHub API request failed after {MAX_RETRIES} attempts: "
            f"{last_exception}"
        ) from last_exception

    return response


def github_error_message(response: requests.Response) -> str:
    """
    從 GitHub API response 擷取安全且有用的錯誤資訊。
    不輸出 Authorization header。
    """
    try:
        data = response.json()

        message = data.get("message")
        documentation_url = data.get("documentation_url")

        if documentation_url:
            return f"{message or 'Unknown GitHub API error'} | {documentation_url}"

        return message or response.text

    except ValueError:
        return response.text


def atomic_write_json(path: Path, data) -> None:
    """
    使用 temporary file + os.replace 進行 atomic write，
    避免寫入途中中斷造成 JSON 半截資料。
    """
    path.parent.mkdir(parents=True, exist_ok=True)

    fd, temp_path = tempfile.mkstemp(
        prefix=f".{path.name}.",
        suffix=".tmp",
        dir=str(path.parent),
    )

    try:
        with os.fdopen(fd, "w", encoding="utf-8") as temp_file:
            json.dump(
                data,
                temp_file,
                ensure_ascii=False,
                indent=2,
            )
            temp_file.write("\n")
            temp_file.flush()
            os.fsync(temp_file.fileno())

        os.replace(temp_path, path)

    except Exception:
        try:
            os.unlink(temp_path)
        except FileNotFoundError:
            pass

        raise


def validate_json_file(path: Path) -> None:
    """
    重新解析 JSON，確認輸出的 JSON 有效。
    """
    with path.open("r", encoding="utf-8") as file:
        json.load(file)


def read_json_file(path: Path):
    """
    讀取 JSON。
    """
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def scan_html_files() -> list[str]:
    """
    遞迴掃描 HTML。

    排除：
    - .git
    - node_modules

    同時對結果排序，確保輸出順序穩定。
    """
    html_files = []

    excluded_directories = {
        ".git",
        "node_modules",
    }

    for root, dirs, files in os.walk("."):
        dirs[:] = [
            directory
            for directory in dirs
            if directory not in excluded_directories
        ]

        for file_name in files:
            if not file_name.lower().endswith(".html"):
                continue

            if file_name.lower() == "index.html":
                continue

            relative_path = Path(root) / file_name

            normalized_path = relative_path.as_posix()

            if normalized_path.startswith("./"):
                normalized_path = normalized_path[2:]

            html_files.append(normalized_path)

    html_files.sort(key=str.casefold)

    return html_files


def build_dynamic_cards(html_files: list[str]) -> list[dict]:
    """
    根據 HTML 檔案產生首頁卡片設定。
    """
    dynamic_cards = []

    for file_path in html_files:
        parts = file_path.split("/")

        if (
            len(parts) > 1
            and parts[-1].casefold() == "index.html"
        ):
            card_id = parts[-2]
            url = f"/{'/'.join(parts[:-1])}/"

        else:
            card_id = parts[-1][:-5]
            url = f"/{file_path}"

        title = PRESET_META.get(
            card_id,
            card_id.upper(),
        )

        dynamic_cards.append(
            {
                "id": card_id,
                "title": title,
                "url": url,
                "image": f"/assets/brand/ms-{card_id}.JPEG",
            }
        )

    return dynamic_cards


def get_github_file(
    session: requests.Session,
    repo: str,
    file_path: str,
    branch: Optional[str] = None,
):
    """
    取得 GitHub repository 中指定檔案。

    回傳：
        {
            "exists": True/False,
            "sha": "...",
            "content": "..."
        }

    嚴格區分：
    - 200：檔案存在
    - 404：檔案不存在
    - 其他：真正的 API 錯誤
    """
    url = (
        f"{GITHUB_API_BASE}/repos/"
        f"{repo}/contents/{file_path}"
    )

    params = {}

    if branch:
        params["ref"] = branch

    response = request_with_retry(
        session,
        "GET",
        url,
        params=params,
    )

    if response.status_code == 200:
        data = response.json()

        encoded_content = data.get("content", "")
        clean_content = encoded_content.replace("\n", "")

        try:
            decoded_content = base64.b64decode(
                clean_content
            ).decode("utf-8")

        except (ValueError, UnicodeDecodeError) as exc:
            raise RuntimeError(
                f"Unable to decode GitHub file content: {file_path}"
            ) from exc

        return {
            "exists": True,
            "sha": data.get("sha"),
            "content": decoded_content,
        }

    if response.status_code == 404:
        return {
            "exists": False,
            "sha": None,
            "content": None,
        }

    if response.status_code == 401:
        raise RuntimeError(
            f"GitHub authentication failed (401) "
            f"while reading {file_path}: "
            f"{github_error_message(response)}"
        )

    if response.status_code == 403:
        raise RuntimeError(
            f"GitHub permission denied (403) "
            f"while reading {file_path}: "
            f"{github_error_message(response)}"
        )

    if response.status_code == 429:
        raise RuntimeError(
            f"GitHub API rate limit exceeded (429) "
            f"while reading {file_path}: "
            f"{github_error_message(response)}"
        )

    raise RuntimeError(
        f"GitHub API GET failed ({response.status_code}) "
        f"for {file_path}: "
        f"{github_error_message(response)}"
    )


def sync_to_github_api(
    session: requests.Session,
    repo: str,
    file_path: str,
    token: str,
    branch: Optional[str] = None,
) -> bool:
    """
    將本地檔案同步到 GitHub Contents API。

    特性：
    - 檔案不存在 → 建立
    - 檔案存在且內容相同 → 不更新
    - 檔案存在且內容不同 → 更新
    - 409 → 重新取得 SHA 後重試
    - 其他 API 錯誤 → 明確失敗
    """
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(
            f"Local file does not exist: {file_path}"
        )

    if not path.is_file():
        raise RuntimeError(
            f"Local path is not a regular file: {file_path}"
        )

    with path.open("r", encoding="utf-8") as file:
        content_str = file.read()

    current = get_github_file(
        session=session,
        repo=repo,
        file_path=file_path,
        branch=branch,
    )

    # 內容完全相同，不建立無意義 commit。
    if current["exists"] and current["content"] == content_str:
        print(
            f"ℹ️ GitHub 已是最新內容，跳過同步: {file_path}"
        )
        return False

    encoded_content = base64.b64encode(
        content_str.encode("utf-8")
    ).decode("utf-8")

    url = (
        f"{GITHUB_API_BASE}/repos/"
        f"{repo}/contents/{file_path}"
    )

    payload = {
        "message": f"auto: MSK synchronized {file_path}",
        "content": encoded_content,
    }

    if branch:
        payload["branch"] = branch

    if current["sha"]:
        payload["sha"] = current["sha"]

    response = request_with_retry(
        session,
        "PUT",
        url,
        json=payload,
    )

    if response.status_code in {200, 201}:
        print(
            f"✅ MSK 自動同步 GitHub 成功: {file_path}"
        )
        return True

    if response.status_code == 409:
        print(
            f"⚠️ GitHub 發生 SHA/內容競態衝突，"
            f"重新取得檔案狀態: {file_path}"
        )

        latest = get_github_file(
            session=session,
            repo=repo,
            file_path=file_path,
            branch=branch,
        )

        if (
            latest["exists"]
            and latest["content"] == content_str
        ):
            print(
                f"ℹ️ 競態期間其他執行已完成相同更新，"
                f"跳過同步: {file_path}"
            )
            return False

        retry_payload = {
            "message": f"auto: MSK synchronized {file_path}",
            "content": encoded_content,
        }

        if branch:
            retry_payload["branch"] = branch

        if latest["sha"]:
            retry_payload["sha"] = latest["sha"]

        retry_response = request_with_retry(
            session,
            "PUT",
            url,
            json=retry_payload,
        )

        if retry_response.status_code in {200, 201}:
            print(
                f"✅ MSK 競態重試後同步成功: {file_path}"
            )
            return True

        raise RuntimeError(
            f"GitHub synchronization failed after conflict retry "
            f"({retry_response.status_code}) for {file_path}: "
            f"{github_error_message(retry_response)}"
        )

    if response.status_code == 401:
        raise RuntimeError(
            f"GitHub authentication failed (401) "
            f"while writing {file_path}: "
            f"{github_error_message(response)}"
        )

    if response.status_code == 403:
        raise RuntimeError(
            f"GitHub permission denied (403) "
            f"while writing {file_path}: "
            f"{github_error_message(response)}"
        )

    if response.status_code == 429:
        raise RuntimeError(
            f"GitHub API rate limit exceeded (429) "
            f"while writing {file_path}: "
            f"{github_error_message(response)}"
        )

    raise RuntimeError(
        f"GitHub synchronization failed "
        f"({response.status_code}) for {file_path}: "
        f"{github_error_message(response)}"
    )


def main():
    """
    Mobsp KYTK automated synchronization core.
    """
    msk_token = os.environ.get("MSK")
    repo = os.environ.get("GITHUB_REPOSITORY")
    branch = os.environ.get("GITHUB_REF_NAME")

    # MSK 是目前這套 API 同步架構的必要授權。
    if not msk_token:
        raise RuntimeError(
            "未檢測到 MSK 密鑰環境變數，"
            "無法執行 GitHub API 同步。"
        )

    if not repo:
        raise RuntimeError(
            "未檢測到 GITHUB_REPOSITORY 環境變數。"
        )

    print(
        "GitHub API authentication configured."
    )
    print(f"Target repository: {repo}")

    if branch:
        print(f"Target branch: {branch}")

    # ---------------------------------------------------------
    # 1. 遞迴掃描 HTML
    # ---------------------------------------------------------
    html_files = scan_html_files()

    print(
        f"HTML 掃描完成，共找到 {len(html_files)} 筆 HTML 資料。"
    )

    # ---------------------------------------------------------
    # 2. 產生動態首頁卡片
    # ---------------------------------------------------------
    dynamic_cards = build_dynamic_cards(
        html_files
    )

    # ---------------------------------------------------------
    # 3. Atomic 寫入 home card config
    # ---------------------------------------------------------
    CONFIG_PATH.parent.mkdir(
        parents=True,
        exist_ok=True,
    )

    atomic_write_json(
        CONFIG_PATH,
        dynamic_cards,
    )

    validate_json_file(CONFIG_PATH)

    print(
        f"自動化掃描完成！"
        f"已成功更新 {len(dynamic_cards)} 筆資料至 "
        f"{CONFIG_PATH}"
    )

    # ---------------------------------------------------------
    # 4. 初始化 / 維持 ledger
    # ---------------------------------------------------------
    if not LEDGER_PATH.exists():
        atomic_write_json(
            LEDGER_PATH,
            [],
        )

        validate_json_file(LEDGER_PATH)

        print(
            f"自動化初始化完成！"
            f"已建立預設記帳檔案 {LEDGER_PATH}"
        )
    else:
        validate_json_file(LEDGER_PATH)

        print(
            f"現有記帳檔案驗證完成: {LEDGER_PATH}"
        )

    # ---------------------------------------------------------
    # 5. GitHub API 同步
    # ---------------------------------------------------------
    session = create_github_session(
        msk_token
    )

    config_changed = sync_to_github_api(
        session=session,
        repo=repo,
        file_path=CONFIG_PATH.as_posix(),
        token=msk_token,
        branch=branch,
    )

    ledger_changed = sync_to_github_api(
        session=session,
        repo=repo,
        file_path=LEDGER_PATH.as_posix(),
        token=msk_token,
        branch=branch,
    )

    print(
        "同步作業完成："
        f" config_changed={config_changed},"
        f" ledger_changed={ledger_changed}"
    )


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        print(f"❌ Mobsp KYTK 執行失敗: {exc}")
        raise