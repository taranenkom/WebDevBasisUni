import os

dir_path = "img/"
counter = 1

for filename in os.listdir(dir_path):
    if filename.endswith(".jpg"):
        os.rename(os.path.join(dir_path, filename), os.path.join(dir_path, str(counter) + ".jpg"))
        counter += 1

print(f"{counter-1} files renamed.")

