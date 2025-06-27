// export const authService = {
//     login: async (email: string, password: string) => {
//         const res = await fetch('http://localhost:3001/api/login', {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ username: email, password }),
//         })

//         if (!res.ok) {
//             const text = await res.text()
//             throw new Error(text || 'Login failed')
//         }

//         const data = await res.json()
//         localStorage.setItem('token', data.token)
//         return data
//     }
// }

export const authService = {
    login: async (username: string, password: string) => {
        const res = await fetch('http://localhost:3001/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })

        const data = await res.json()

        if (!res.ok) {
            throw data // will contain { field, detail } if backend sends it
        }

        localStorage.setItem('token', data.token)
        return data
    }
}

