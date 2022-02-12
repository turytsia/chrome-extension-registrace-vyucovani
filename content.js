const confirmButton = document.getElementsByName("potvrdit_volbu_vyucovani")[1];
const schedule = document.getElementsByClassName("rozvrh")[0];
const timeInput = document.createElement("input");
const readme = document.createElement('pre')
const warning = document.createElement('pre')
const warningTitle = document.createElement('span')

schedule.style.display = "flex";
schedule.style.flexDirection = "column";
schedule.style.alignItems = 'center'

timeInput.type = "time";
timeInput.style.width = '50%'
timeInput.style.display = "block";
timeInput.style.fontSize = '14px'
timeInput.style.margin = '15px 0'

readme.style.textAlign = 'center'
readme.style.margin = '15px 0'
readme.innerHTML = `#README\nChoose subjects you want to register and\npick time when registration opens.\nWhen it's time, the browser will sign you in automatically.`

warning.style.border = '1px solid #AA2121'
warning.style.textAlign = 'center'
warning.style.backgroundColor = '#FFD1D1'
warning.innerHTML = `#WARNING\nIf you pick 2 the same subjects, you won't be able to register it properly.\nBe aware that extention is still in development phase\nso use it on your risk.\n If you found bug, report it here: italexx.cz@gmail.com`

schedule.prepend(timeInput);
schedule.prepend(warning);
schedule.prepend(readme);

//chrome.storage.local.clear()

const blocks = Array.from(document.getElementsByClassName("blok-kapacita"));
const parentInputs = Array.from(
    document.getElementsByClassName("custom-control custom-radio radio-new2")
);

const inputs = parentInputs.map((parentInput) => parentInput.children[0]);

let subjectsToSave = [];
let checkboxes = [];
let updateTime;

timeInput.onchange = (e) => {
    updateTime = e.target.value;
};

chrome.storage.local.get("subjects", (res) => { // <------------------------
    console.log(res)
    subjectsToSave = res.subjects ? [...res.subjects.split(",")] : [];

    blocks.map((block, i) => {
        const checkbox = document.createElement("input");
        const id = inputs[i].id;
        //styles
        checkbox.type = "checkbox";
        checkbox.style.textAlign = "center";
        checkbox.style.display = "block";
        checkbox.checked = subjectsToSave.includes(id);
        checkbox.style.height = '18px'
        checkbox.style.width = '18px'
        checkbox.style.margin = '10px auto'

        checkboxes.push(checkbox);

        function checkboxClickHandler() {
            if (subjectsToSave.includes(id)) {
                subjectsToSave = subjectsToSave.filter((subject) => subject !== id);
            } else {
                subjectsToSave.push(id);
            }
            chrome.storage.local.set({ subjects: subjectsToSave.toString() });

            chrome.storage.local.get("subjects", (res) => {
                console.log(res);
            });
        }

        checkbox.addEventListener("click", checkboxClickHandler);
        block.append(checkbox);
    });

    function repeatEvery(func, interval) {
        // Check current time and calculate the delay until next interval
        var now = new Date(),
            delay = interval - (now % interval);

        function start() {
            func();
            // ... and every interval
            setInterval(func, interval);
        }

        // Delay execution until it's an even interval
        setTimeout(start, delay);
    }

    function submitHandler() {
        const currentTime = new Date();
        if (currentTime.toTimeString().includes(updateTime)) {

            for (let i = 0; i < checkboxes.length; i++) {
                if (subjectsToSave.includes(inputs[i].id)) {
                    inputs[i].parentElement.click();
                    console.log('click')
                }
            }

            confirmButton.click();
        }
    }

    repeatEvery(submitHandler, 60 * 1000);
});