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
            const response = await axios.post('/login',userData)
            if(response && response.data){
                alert(response.data.message)
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