function getObject(shape, indexObject) {
    var list = document.getElementById("List");
    var object = document.createElement("div");
    object.innerHTML = `
        <input type="checkbox" id="${shape[0]}${indexObject}" name="${shape[0]}${indexObject}" value="${shape[0]}${indexObject}" >
        <label for="${shape[0]}${indexObject}">${shape[0]}[${indexObject}]</label><br>
    `;
    list.appendChild(object);
}