import os
import re

REVERT = {
    r'\btext-main-foreground\b': 'text-primary-foreground',
    r'\btext-faint-foreground\b': 'text-muted-foreground',
    r'\bbg-brand-hover\b': 'bg-accent-hover',
    r'\bbg-brand-subtle\b': 'bg-accent-subtle',
    r'\bborder-brand\b': 'border-accent',
    r'\btext-brand-foreground\b': 'text-accent-foreground',
    r'\btext-main\b': 'text-primary',
    r'\btext-sub\b': 'text-secondary',
    r'\btext-faint\b': 'text-muted',
    r'\btext-dim\b': 'text-placeholder',
    r'\bbg-brand\b': 'bg-accent',
    r'\bbg-canvas\b': 'bg-page',
    r'\bbg-panel-hover\b': 'bg-card-hover',
    r'\bbg-panel\b': 'bg-card',
    r'\bbg-field\b': 'bg-input',
    r'\bbg-raised\b': 'bg-elevated',
    r'\bborder-base\b': 'border-default',
    r'\bborder-ghost\b': 'border-subtle',
    r'\bborder-hovered\b': 'border-hover',
}

UI_DIR = os.path.join(os.path.dirname(__file__), '..', 'src', 'components', 'ui')

count = 0
for root, dirs, files in os.walk(UI_DIR):
    for fname in files:
        if not fname.endswith(('.tsx', '.ts', '.css')):
            continue
        path = os.path.join(root, fname)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = content
        for pattern, repl in REVERT.items():
            new_content = re.sub(pattern, repl, new_content)
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            print(f'Reverted: {fname}')

print(f'\nDone. {count} UI files reverted.')
