import re

with open('frontend/src/LandingPage.jsx', 'r', encoding='utf-8') as f:
    landing = f.read()

anchors = re.findall(r'id=["\']i3owk[^"\']*["\']', landing)
print("Found anchors in LandingPage.jsx:", anchors)

scene_div = re.findall(r'id=["\'](?:ip1j|ijsk)["\']', landing)
print("Found scene divs in LandingPage.jsx:", scene_div)
