document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.querySelector('form')

    const submitForm = async (event) => {
        event.preventDefault()
        const name= document.getElementById('name').value
        const email= document.getElementById('email').value
        const phone= document.getElementById('phone').value
        const password= document.getElementById('password').value

        const userData = {
            name,
            email,
            phone,
            password
        }

        try {
            const response = await axios.post('/signup',userData)

            alert (response.data.message)

            document.getElementById('name').value =""
            document.getElementById('email').value =""
            document.getElementById('phone').value =""
            document.getElementById('password').value =""

            window.location.href = '../login/login.html'

        }catch (error) {
            alert(error.response.data.error)
        }
    
    
    }
    signupForm.addEventListener('submit',submitForm)

})