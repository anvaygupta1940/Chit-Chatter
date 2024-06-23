// collection of all api calls from frontend to backend
const backendDomain = process.env.REACT_APP_BACKEND_URL
// const backendDomain = "http://localhost:8000"

const SummaryApi = {
    register: {
        url: `${backendDomain}/api/register`,
        method: "post"
    },
    checkEmail: {
        url: `${backendDomain}/api/email`,
        method: "post"
    },
    checkPassword: {
        url: `${backendDomain}/api/password`,
        method: "post"
    },
    userDetail: {
        url: `${backendDomain}/api/user-details`,
        method: "get"
    },
    updateUser: {
        url: `${backendDomain}/api/update-user`,
        method: "post"
    },
    searchUser: {
        url: `${backendDomain}/api/search-user`,
        method: "post"
    }
}

export default SummaryApi;
