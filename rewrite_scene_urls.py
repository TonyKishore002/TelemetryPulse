import json

target_files = [
    'frontend/public/scene-state/aefb19b0-0589-4c37-878d-126365187019.json',
    'scene-state/aefb19b0-0589-4c37-878d-126365187019.json',
    'frontend/dist/scene-state/aefb19b0-0589-4c37-878d-126365187019.json'
]

for path in target_files:
    try:
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        count = content.count('https://files.peachworlds.com/')
        print(f"{path}: found {count} occurrences of https://files.peachworlds.com/")
        if count > 0:
            new_content = content.replace('https://files.peachworlds.com/', '/files.peachworlds.com/')
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Replaced in {path}")
    except Exception as e:
        print(f"Error processing {path}: {e}")
