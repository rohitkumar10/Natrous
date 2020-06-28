const loginForm = document.querySelector('.form--login')
const logOutBtn = document.querySelector('.nav__el--logout')

const login = async (email, password) => {
    //console.log(email, password)
    try {
        const res = await axios({
            method: 'POST',                // generates jwt
            url: 'http://127.0.0.1:3000/api/v1/users/login',
            data: {
                email,
                password
            }
        })
        //console.log(res)
        if(res.data.status === 'success'){
            // alert('Logged in Successfully!')
            showAlert('success', 'Logged in Successfully!');
            window.setTimeout(() => {
                location.assign('/');
            }, 1500)
        }
    } catch (err) {
        // alert(err.response.data)
        showAlert('error', err.response.data.message)
        // console.log(err.response.data)
    }
}

const logout = async () => {
    try {
        const res = await axios({
            method: 'GET',
            url: 'http://127.0.0.1:3000/api/v1/users/logout'
        });
        if ((res.data.status = 'success')) location.reload(true);
    } catch (err) {
        console.log(err.response);
        showAlert('error', 'Error logging out! Try again.');
    }
}

if(loginForm){
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password)
    })
}

if(logOutBtn){
    logOutBtn.addEventListener('click', logout)
}




// 1
// const login = async (email, password) => {
//     alert(email, password);      // does not change url so no jwt is generated
// }

// document.querySelector('.form').addEventListener('submit', e => {
//     e.preventDefault()
//     const email = document.getElementById('email').value
//     const password = document.getElementById('password').value
//     login(email, password)

// })
