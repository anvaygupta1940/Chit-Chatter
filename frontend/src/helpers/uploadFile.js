const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`

// console.log("dotenv data >>", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
const uploadFile = async (image) => {
    // first convert image in formData
    const formData = new FormData();
    formData.append("file", image)
    formData.append("upload_preset", "chat-app");

    const res = await fetch(url, {
        method: "post",
        body: formData
    })

    const result = await res.json();
    return result;
}

export default uploadFile;