document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.querySelector('form')

    const submitForm = async (event) => {
        event.preventDefault()
        const email = document.getElementById('email').value 
        const password = document.getElementById('password').value 

        const userData = {
            email,
            password,
        }
        // console.log(userData)

        try{
            const response = await axios.post('/user/login',userData)
            if(response && response.data){
                localStorage.setItem('token', response.data.token)
                alert(response.data.message)
                window.location.href = '../chat/chat.html'
                
                
            }else{
                console.error("Unexpected response structures", response)
            }
            
        }catch(error){
            if (error.response && error.response.data) {
            alert(error.response.data.error)
            }else {
                console.error('Unexpected error structure:', error);
            }
        }
    }
    loginForm.addEventListener('submit',submitForm)
})