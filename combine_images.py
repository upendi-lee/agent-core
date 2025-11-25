from PIL import Image
import os

# 이미지 파일 경로
base_path = r'C:\Users\User\.gemini\antigravity\brain\25c7d904-cd1f-4da4-af82-4321a1df8ef6'
image_files = [
    'walkthrough_page_1_1763699372411.png',
    'walkthrough_page_2_1763699386101.png',
    'walkthrough_page_3_1763699399561.png',
    'walkthrough_page_4_1763699412679.png',
    'walkthrough_page_5_1763699426706.png'
]

# 이미지 로드
images = []
for filename in image_files:
    filepath = os.path.join(base_path, filename)
    if os.path.exists(filepath):
        images.append(Image.open(filepath))
        print(f"Loaded: {filename}")
    else:
        print(f"Not found: {filename}")

if not images:
    print("No images found!")
    exit(1)

# 전체 높이와 최대 너비 계산
total_height = sum(img.height for img in images)
max_width = max(img.width for img in images)

print(f"Total height: {total_height}px")
print(f"Max width: {max_width}px")

# 새 이미지 생성 (흰색 배경)
combined_image = Image.new('RGB', (max_width, total_height), 'white')

# 이미지들을 세로로 붙이기
y_offset = 0
for img in images:
    combined_image.paste(img, (0, y_offset))
    y_offset += img.height

# 저장
output_path = r'c:\Intel\agent-core\agent-core\walkthrough_complete.png'
combined_image.save(output_path, 'PNG')
print(f"\n✅ Combined image saved to: {output_path}")
print(f"Final size: {max_width}x{total_height}px")
