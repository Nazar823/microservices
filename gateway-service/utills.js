module.exports.getServiceName = async(URL) => {
    switch (URL) {
        case 'message':
            return process.env.MESSAGE_SERVICE
        case 'auth':
            return process.env.REGISTRATION_SERVICE
        case 'blog':
            return process.env.BLOG_SERVICE
            return null
    }
}