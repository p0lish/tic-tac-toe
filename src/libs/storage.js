export default {
    loadItem: function (key) {
        let item = JSON.parse(localStorage.getItem(key));
        console.log("load: ", item);
        return item;
    },

    saveItem: function (key, data) {
        console.log("save: ", data);
        let item = JSON.stringify(data);
        localStorage.setItem(key, item);
    },
}