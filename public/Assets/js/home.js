let data;

window.onload = () => {
    async function dataGet() {
        let getData = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        await fetch('/api/GetAll', getData)
            .then(response => response.json())
            .then(data => {
                data = data;
                console.log(data);
            });
    }
    dataGet();
}    

