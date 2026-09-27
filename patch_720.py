import os

target_files = [
    'frontend/public/720.script.js',
    'frontend/dist/720.script.js',
    '720.script.js'
]

# Old u definition:
# const u=(e,t,n="/")=>l(void 0,void 0,void 0,(function*(){const o=`${(0,s.gZ)(n)}${e}`,r=yield(0,c.x)(o);if(!r)throw new Error(`Failed to fetch "${o}".`);const i=yield fetch(r),a=i.headers.get("content-type")||"";if(!a.includes(t))throw new Error(`Unexpected content type "${a}" for file "${o}".`);return i}))
# New u definition:
# const u=(e,t,n="/")=>l(void 0,void 0,void 0,(function*(){const o=`${(0,s.gZ)(n)}${e}`;let r;try{window._pwLoadFileFromCache&&(r=yield(0,c.x)(o))}catch(err){}r||(r=o);const i=yield fetch(r);return i}))

old_u = 'const u=(e,t,n="/")=>l(void 0,void 0,void 0,(function*(){const o=`${(0,s.gZ)(n)}${e}`,r=yield(0,c.x)(o);if(!r)throw new Error(`Failed to fetch "${o}".`);const i=yield fetch(r),a=i.headers.get("content-type")||"";if(!a.includes(t))throw new Error(`Unexpected content type "${a}" for file "${o}".`);return i}))'
new_u = 'const u=(e,t,n="/")=>l(void 0,void 0,void 0,(function*(){const o=`${(0,s.gZ)(n)}${e}`;let r;try{window._pwLoadFileFromCache&&(r=yield(0,c.x)(o))}catch(err){}r||(r=o);const i=yield fetch(r);return i}))'

old_d = 'const d=new Promise((e=>{u=e}));'
new_d = 'const d=new Promise((e=>{u=e;setTimeout(e,2500);}));'

for path in target_files:
    if not os.path.exists(path):
        continue
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    patched = False
    if old_u in content:
        content = content.replace(old_u, new_u)
        print(f"Patched u in {path}")
        patched = True
    else:
        print(f"old_u not found in {path}")
        
    if old_d in content:
        content = content.replace(old_d, new_d)
        print(f"Patched d in {path}")
        patched = True
    else:
        print(f"old_d not found in {path}")

    if patched:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Saved {path}")
