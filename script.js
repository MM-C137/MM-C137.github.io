const DarkMode = {
    toggleDarkMode(){
        document.querySelector('html').classList.toggle("dark-mode"); 
    },
    checkInput(){
        if(document.querySelector("#switch").checked) this.toggleDarkMode();
    }
}

const ConfirmCard = {
    toggleConfirmCard(small){
        if(document.querySelectorAll(".confirm-card.active").length == 0 || small == document.querySelector(".confirm-card small").textContent){
            document.querySelector(".confirm-card").classList.add("active");
            document.querySelector(".confirm-card small").innerHTML = small;
        }else{
            document.querySelector(".confirm-card").classList.remove("active");

            setTimeout(()=>{
                document.querySelector(".confirm-card").classList.add("active");
                document.querySelector(".confirm-card small").innerHTML = small;
            },675)
        }
        
    },
    removeConfirmCard(){
        document.querySelector(".confirm-card").classList.remove("active");
    },
    editConfirmCard(small, fun){
        document.querySelector("#ConfirmButton").setAttribute("onclick", `${fun}`);
        ConfirmCard.toggleConfirmCard(`${small}`);
    },
    confirmCheckbox(index){
        document.querySelector(`#task${index}`).checked = true;

        TasksData[index].checked = 1;
        Database.setTaskDay(TasksData);

        location.reload();
    },
    confirmFavourite(index){
        TasksData[index].fav = 1;
        Database.setTaskDay(TasksData);

        let favoriteTask = TasksData[index];
        favoriteTask.checked = 0;

        FavouritesData.push(favoriteTask);
        Database.setFavourites(FavouritesData);

        location.reload();
    },
    confirmFavouriteInTaskDay(index){
        TasksData.push(FavouritesData[index]);
        Database.setTaskDay(TasksData);

        location.reload();
    },
    confirmRemoveFavourite(index){
        TasksData.forEach((value)=>{
            if(value.nome == FavouritesData[index].nome) value.fav= 0;
        })

        FavouritesData.splice(index, 1);
        Database.setFavourites(FavouritesData);
        Database.setTaskDay(TasksData);
        
        location.reload();
    }
}

const AsideCard = {
    asideCardContent: document.querySelector(".aside-card-content"),
    toggleAsideCard(kind){
        if(document.querySelectorAll(".aside-card.active").length == 0 || kind == document.querySelector(".aside-card-title h2").textContent){
            document.querySelector(".aside-card").classList.add("active");
            document.querySelector(".aside-card-title h2").innerHTML = kind;
        }else{
            document.querySelector(".aside-card").classList.remove("active");

            setTimeout(()=>{
                document.querySelector(".aside-card-title h2").innerHTML = kind;
                document.querySelector(".aside-card").classList.add("active");
            },475)
        }
    },
    removeAsideCard(){
        document.querySelector(".aside-card").classList.remove("active");
    },
    innerContent(name){
        let index = document.querySelectorAll(".task-card").length;

        this.asideCardContent.innerHTML += `
        <div class="task-card">
            <div class="task-card-name" onclick="Favourites.addFavouriteInTodayTask(${index})">${name}</div>
            <div class="task-card-del" onclick="Favourites.removeFavourite(${index})">-</div>
        </div>
        `
    }
}

const Database = {
    getTaskDay(){
        return JSON.parse(localStorage.getItem("lList:database")) || [];
    },
    setTaskDay(data){
        localStorage.setItem("lList:database", JSON.stringify(data));
    },
    getFavourites(){
        return JSON.parse(localStorage.getItem("lList:favourites")) || [];
    },
    setFavourites(data){
        localStorage.setItem("lList:favourites", JSON.stringify(data));
    },
    setLastDate(data){
        localStorage.setItem("lList:date", data);
    }
}

const TasksData = Database.getTaskDay();
const FavouritesData = Database.getFavourites();
const SuggestionsData = ["1skflsçflks", "2sdjsdkjsd", "3dsdlksdç"]

const Tasks = {
    checkTaskNumber(){
        if(document.querySelectorAll(".task").length > 4) return 0;
        return 1;
    },
    addTask(name, check, fav){
        let taskLength = document.querySelectorAll(".task").length;

        document.querySelector(".task-content").innerHTML += `
        <div class="task">
            <input type="checkbox" name="task${taskLength}" id="task${taskLength}" onclick="Tasks.confirmTask(${taskLength})" ${(check == 1) ? "checked" : ""}>
            ${(check == 1) ? `<span>${name}</span> <span class="star" ${(fav == 1) ? 'style="cursor: context-menu"' : `onclick="Favourites.addFavourite(${taskLength})"`}>${(fav == 1) ? '&starf;' : '&star;'}</span>` : `<input type="text" value="${name}">`}
        </div>
        `;  
    },
    confirmTask(value){
        if(document.querySelector(`#task${value}`).checked == false) document.querySelector(`#task${value}`).checked = true;
        else{
            document.querySelector(`#task${value}`).checked = false;

            ConfirmCard.editConfirmCard( `If check "${TasksData[value].nome}", you cannot uncheck`  , `ConfirmCard.confirmCheckbox(${value})`)
        }
    },
}


const Favourites = {
    addFavouritesInAsideCard(){
        AsideCard.asideCardContent.innerHTML = "";
        FavouritesData.forEach((value)=>{
            AsideCard.innerContent(value.nome);
        })
    },
    addFavourite(index){
        ConfirmCard.editConfirmCard(`Do you really want to favorite "${TasksData[index].nome}"?`, `ConfirmCard.confirmFavourite(${index})`);
    },
    addFavouriteInTodayTask(index){
        if(Tasks.checkTaskNumber()) ConfirmCard.editConfirmCard(`Add "${FavouritesData[index].nome}" to your daily tasks?`, `ConfirmCard.confirmFavouriteInTaskDay(${index})`);
        else{
            document.querySelectorAll(".task-card-name")[index].animate([
                {transform: "translateX(.5rem)", color: "red"},
                {transform: "translateX(-.5rem)"},
                {transform: "translateX(0)", color: "red"}
                
            ], 100)
        }
    },
    removeFavourite(index){
        ConfirmCard.editConfirmCard(`Remove "${FavouritesData[index].nome}" from your favourites?`, `ConfirmCard.confirmRemoveFavourite(${index})`)
    }
}

const Suggestions = {
    addSuggestionsInAsideCard(){
        AsideCard.asideCardContent.innerHTML = "";
        SuggestionsData.forEach((value)=>{
            AsideCard.innerContent(value)
        })
    },
}

const Utils = {
    getDateToday(){
        let date = new Date;

        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();

        return this.formatData(day, month, year);
    },
    formatData(day, month, year){
        return `${(day > 9) ? day : '0'+day} / ${(month+1 > 9) ? month+1 : '0'+(month+1)} / ${year}`;
    },
    checkDate(lastDate){
        if(lastDate == this.getDateToday()) return 1;
        return 0;
    }
}

const DOM = {
    dataContent: document.querySelector(".data-content"),
    taskListContent: document.querySelector(".task-list-content"),
    innerDataDay(){
        let date = new Date;

        this.dataContent.innerHTML = Utils.getDateToday();
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

        if(name.trim() === "") return event.preventDefault();
        
        let obj = {
            nome: name,
            checked: 0,
            fav: 0,
        }

        TasksData.push(obj);
        Database.setTaskDay(TasksData);

        location.reload();
    }
}

const App = {
    init(){

        DOM.innerDataDay();
        DarkMode.checkInput();

        console.log(TasksData)


        if(Utils.checkDate(localStorage.getItem("lList:date"))){
            TasksData.forEach((value)=>{
                Tasks.addTask(value.nome, value.checked, value.fav);
            });

            Database.setLastDate(Utils.formatData())
        }else{
            TasksData.length = 0;
            Database.setTaskDay(TasksData);
        }

        Database.setLastDate(Utils.getDateToday());
        

        DOM.checkAddContentInput();

    },
    reload(){
        
    }
}

App.init();
