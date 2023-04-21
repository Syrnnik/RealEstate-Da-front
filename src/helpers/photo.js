const checkPhotoPath = (path = '') => path?.length
    ? path.includes('http')
        ? path
        : `${process.env.REACT_APP_PHOTO_URL}/uploads/${path}`
    : '/img/nophoto.jpg'

export {checkPhotoPath}