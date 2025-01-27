import fs from 'fs';

const Controller = (app) => {

    function getData(){
        return JSON.parse(fs.readFileSync("data.json").toString());
    }
    
    function writeData(data){
        fs.writeFileSync("data.json", JSON.stringify(data));
    }

    const createItem = async (req, res) => {
        const data = getData();
        const newItem = req.body;
        newItem.available = true;
        data["items"].push(req.body);
        writeData(data);
    };

    const getAllItems = async (req, res) => {
        res.json(getData().items);
    };

    const getAvailableItems = async (req, res) => {
        res.json(getData().items.filter(
            (item) => 
                item.available
                && (!req.body.upper || item.pricePerDay <= req.body.upper)
                && (!req.body.lower || item.pricePerDay >= req.body.lower)
             && (!req.body.name || item.name === req.body.name)
            ));
    };

    const rentItem = async (req, res) => {
        const data = getData();
        const i = data.items.find(item => +req.params.itemId === item.id);
        
        if(i.available){
            i.available = false;
            i.expectedReturnDate = req.body.expectedReturnDate;
            writeData(data); 
        } else{
            res.json({message: "Item is currently rented out, sorry for any inconvenience"});
            return;
        }
        
        res.json(i);
    };

    const returnItem = async (req, res) => {
        const data = getData();
        const i = data.items.find(item => +req.params.itemId === item.id);
        i.available = true;
        i.expectedReturnDate = "";
        writeData(data); 
        res.json(i);
    };


    app.post("/api/items/create", createItem);
    app.get("/api/items/get/all", getAllItems);
    app.get("/api/items/get/available", getAvailableItems);

    app.post("/api/items/rent/:itemId", rentItem);
    app.post("/api/items/return/:itemId", returnItem);




};
export default Controller;

