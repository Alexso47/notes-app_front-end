import axios from 'axios'
//const baseUrl = 'https://safe-eyrie-72931.herokuapp.com/api/notes'
// Como el frontend se ha incluido en el deploy del backend y se encuentran en el mismo dominio, podemos utilizar path relativo
const baseUrl = '/api/notes'

let token = null

const setToken = newToken => {
  	token = `Bearer ${newToken}`
}

const getAll = async () => {
	const config = {
		headers: { Authorization: token },
	}

	const response = await axios.get(baseUrl, config)
	return response.data
}

const create = async newObject => {
	const config = {
		headers: { Authorization: token },
	}

	const response = await axios.post(baseUrl, newObject, config)
	return response.data
}

const update = async (id, newObject) => {
  	const config = {
		headers: { Authorization: token },
  	}

  	const response = await axios.put(`${baseUrl}/${id}`, newObject, config)
  	return response.data
}

export default { getAll, create, update, setToken }