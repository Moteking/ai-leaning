"""共通ユーティリティ"""
import json
import logging
from datetime import datetime
from pathlib import Path

from config.settings import LOG_DIR


def get_logger(name: str) -> logging.Logger:
    logger = logging.getLogger(name)
    if not logger.handlers:
        logger.setLevel(logging.INFO)
        fh = logging.FileHandler(
            LOG_DIR / f"{name}_{datetime.now():%Y%m%d}.log", encoding="utf-8"
        )
        fh.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
        logger.addHandler(fh)
        sh = logging.StreamHandler()
        sh.setFormatter(logging.Formatter("%(asctime)s [%(levelname)s] %(message)s"))
        logger.addHandler(sh)
    return logger


def load_json(path: Path) -> dict | list:
    if path.exists():
        return json.loads(path.read_text(encoding="utf-8"))
    return {}


def save_json(path: Path, data: dict | list) -> None:
    path.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")


def call_claude(prompt: str, system: str = "", max_tokens: int = 4096) -> str:
    """Claude APIを呼び出してテキストを返す"""
    import anthropic
    from config.settings import ANTHROPIC_API_KEY, CLAUDE_MODEL

    client = anthropic.Anthropic(api_key=ANTHROPIC_API_KEY)
    messages = [{"role": "user", "content": prompt}]
    kwargs = {"model": CLAUDE_MODEL, "max_tokens": max_tokens, "messages": messages}
    if system:
        kwargs["system"] = system
    response = client.messages.create(**kwargs)
    return response.content[0].text
