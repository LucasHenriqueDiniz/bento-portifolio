import re

path = r"E:\Repositories\portifolio\artifacts\portfolio\src\pages\resume.tsx"

with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# Remove remaining ACCENT constant line if still there (shouldn't be)
content = re.sub(r'^const ACCENT = "#3d72cc";\n', '', content, flags=re.MULTILINE)

# Replace simple style={{ color: ACCENT }} with className additions when possible
# But safer: replace ACCENT with var(--accent) in all style props
content = content.replace('style={{ color: ACCENT }}', 'className="text-brand"')
content = content.replace('style={{ borderColor: ACCENT }}', 'className="border-brand"')
content = content.replace('style={{ backgroundColor: ACCENT }}', 'className="bg-brand"')
content = content.replace('style={{ color: ACCENT }}', 'style={{ color: "var(--accent)" }}')
content = content.replace('style={{ borderColor: ACCENT }}', 'style={{ borderColor: "var(--accent)" }}')
content = content.replace('style={{ backgroundColor: ACCENT }}', 'style={{ backgroundColor: "var(--accent)" }}')

# Fix any remaining ACCENT references
content = content.replace('ACCENT', '"var(--accent)"')

# Fix double quotes issue: "var(--accent)" inside JSX style should be 'var(--accent)'
content = content.replace('""var(--accent)""', '"var(--accent)"')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Done")
