import os
import re

REPLACEMENTS = {
    r'\bbg-page\b': 'bg-canvas',
    r'\bbg-card\b': 'bg-panel',
    r'\bbg-card-hover\b': 'bg-panel-hover',
    r'\bbg-input\b': 'bg-field',
    r'\btext-primary\b': 'text-main',
    r'\btext-secondary\b': 'text-sub',
    r'\btext-muted\b': 'text-faint',
    r'\btext-accent\b': 'text-brand',
    r'\bbg-accent\b': 'bg-brand',
    r'\bbg-accent-hover\b': 'bg-brand-hover',
    r'\bbg-accent-subtle\b': 'bg-brand-subtle',
    r'\bborder-accent\b': 'border-brand',
    r'\bborder-default\b': 'border-base',
    r'\bborder-subtle\b': 'border-ghost',
}

BASE = os.path.join(os.path.dirname(__file__), '..', 'src')

count = 0
for root, dirs, files in os.walk(BASE):
    for fname in files:
        if not fname.endswith(('.tsx', '.ts', '.css')):
            continue
        path = os.path.join(root, fname)
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        new_content = content
        for pattern, repl in REPLACEMENTS.items():
            new_content = re.sub(pattern, repl, new_content)
        if new_content != content:
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            print(f'Updated: {os.path.relpath(path, BASE)}')

print(f'\nDone. {count} files updated.')
