export default () => ({
    port        :  parseInt(process.env.PORT, 10) || 3000,
    api_url     : process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1',
    api_login   : process.env.REACT_APP_API_LOGIN || '/account/signin',
    api_profile : process.env.REACT_APP_API_PROFILE || '/account/me',
    api_currency: process.env.REACT_APP_API_CURRENCY || '/currency/'
});