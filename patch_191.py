import os

target_files = [
    'frontend/public/191.script.js',
    'frontend/dist/191.script.js',
    '191.script.js'
]

old_o = 'if(!window._pwLoadFileFromCache)throw new Error("Load file from cache function missing.");'
new_o = 'if(!window._pwLoadFileFromCache)return e;'

for path in target_files:
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    if old_o in content:
        content = content.replace(old_o, new_o)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Patched o in {path}")
    else:
        print(f"old_o not found in {path}")
