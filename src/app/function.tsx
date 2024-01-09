export default function info(input: any){
    const data = fetch(`https://localhost:4000/api/colis/${input}`).then(data => data.json)
    .then(jsondata => {})

} 