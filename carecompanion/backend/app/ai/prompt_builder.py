"""
Prompt Builder.

Loads prompt templates and injects context variables.
Prompt templates are stored in ai/prompts/ as markdown files.
"""

from pathlib import Path

PROMPTS_DIR = Path(__file__).parent / "prompts"


def load_prompt(template_name: str) -> str:
    """
    Load a prompt template from the prompts directory.

    Args:
        template_name: Filename of the template (e.g., 'chat_prompt.md').

    Returns:
        Template content as string.
    """
    template_path = PROMPTS_DIR / template_name
    if not template_path.exists():
        return ""
    return template_path.read_text(encoding="utf-8")


def build_prompt(template_name: str, **kwargs) -> str:
    """
    Load a prompt template and inject context variables.

    Args:
        template_name: Filename of the template.
        **kwargs: Variables to inject into the template.

    Returns:
        Formatted prompt string.
    """
    template = load_prompt(template_name)
    try:
        return template.format(**kwargs)
    except KeyError:
        # If a placeholder is missing, return template with available substitutions
        for key, value in kwargs.items():
            template = template.replace("{" + key + "}", str(value))
        return template


def get_system_prompt() -> str:
    """Load the system prompt that's included with every request."""
    return load_prompt("system_prompt.md")
