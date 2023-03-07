const DarkMode = {
    toogleDarkMode(){
        document.querySelector('html').classList.toggle("dark-mode"); 
    },
    checkInput(){
        if(document.querySelector("#switch").checked) this.toogleDarkMode();
    }
}

const ConfirmCard = {
    toogleConfirmCard(){
        document.querySelector(".confirm-card").classList.toggle("active");
    },
    activeConfirmCard(){
        document.querySelector(".confirm-card").classList.add("active");
    },
    confirmCheckbox(value){
        document.querySelector(`#task${value}`).checked = true;

        TasksData[value].checked = 1;
        Database.set(TasksData);
    }
}

const AsideCard = {
    toggleAsideCard(){
        document.querySelector(".aside-card").classList.toggle("active");
    }
}

const Database = {
    get(){
        return JSON.parse(localStorage.getItem("lList:database")) || [];
    },
    set(data){
        localStorage.setItem("lList:database", JSON.stringify(data));
    }
}

const TasksData = Database.get();

const Tasks = {
    checkTaskNumber(){
        if(document.querySelectorAll(".task").length > 4) return 0;
        return 1;
    },
    addTask(name, check){
        let taskLength = document.querySelectorAll(".task").length;

        document.querySelector(".task-content").innerHTML += `
        <div class="task">
            <input type="checkbox" name="task${taskLength}" id="task${taskLength}" onclick="Tasks.confirmTask(${taskLength})" ${(check == 1) ? "checked" : ""}>
            ${(check == 1) ? `<span>${name}</span> <span>&starf;</span>;` : `<input type="text" value="${name}">`}
        </div>
        `;  
    },
    confirmTask(value){
        if(document.querySelector(`#task${value}`).checked == false) document.querySelector(`#task${value}`).checked = true;
        else{
            document.querySelector(`#task${value}`).checked = false;

            document.querySelector("#spanTaskName").innerHTML = TasksData[value].nome;           ConfirmCard.activeConfirmCard();
            document.querySelector("#ConfirmButton").setAttribute("onclick", `ConfirmCard.confirmCheckbox(${value})`);
        }
    },
    favouriteTask(value){
        
    }
}

const Utils = {
    formatData(day, month, year){
        return `${(day > 9) ? day : '0'+day} / ${(month+1 > 9) ? month+1 : '0'+(month+1)} / ${year}`;
    }
}

const DOM = {
    dataContent: document.querySelector(".data-content"),
    taskListContent: document.querySelector(".task-list-content"),
    getDataDay(){
        let date = new Date;

        this.dataContent.innerHTML = Utils.formatData(date.getDate(), date.getMonth(), date.getFullYear())
    },
    checkAddContentInput(){
        if(Tasks.checkTaskNumber()){
            this.taskListContent.innerHTML += `
            <div class="add-task-content">
                <form action="" onsubmit="Form.submit(event)">
                    <label for="newTaskInput">
                        <input type="checkbox" disabled>
                        <input type="text" name="newTaskInput" id="newTaskInput" placeholder="..." autocomplete="off" maxlength="25">
                    </label>
                </form>
            </div>
            `;
        }
    }
}

const Form = {
    submit(event){
        let name = document.querySelector("#newTaskInput").value;
        // event.preventDefault();
        let obj = {
            nome: name,
            checked: 0
        }

        TasksData.push(obj);
        Database.set(TasksData);
    }
}

const App = {
    init(){
        DOM.getDataDay();
        DarkMode.checkInput();

        console.log(TasksData)

        TasksData.forEach((value)=>{
            Tasks.addTask(value.nome, value.checked);
        })
        DOM.checkAddContentInput();

    },
    reload(){

    }
}

App.init();