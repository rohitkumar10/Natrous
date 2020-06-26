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
            alert('Logged in Successfully!')
            window.setTimeout(() => {
                location.assign('/');
            }, 1500)
        }
    } catch (err) {
        alert(err.response.data)
        //console.log(err.response.data)
    }
}

document.querySelector('.form').addEventListener('submit', e => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    login(email, password)
})




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
