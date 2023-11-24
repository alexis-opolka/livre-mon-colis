export default function info(input){
    const data = fetch(`https://localhost:4000/api/colis/${input}`).then(data => data.json)
    .then(jsondata  )

} 