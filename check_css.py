with open('frontend/styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

import re
matches = re.findall(r'#[a-zA-Z0-9_\-]+\s*\{[^}]*\}', css)
for m in matches:
    if 'ip1j' in m or 'ijsk' in m:
        print(m, '\n---')
