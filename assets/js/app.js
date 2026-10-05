var cl = console.log;

const form = document.getElementById("form")
const crossMark = document.getElementById("crossMark")
const title = document.getElementById("title")
const poster = document.getElementById("poster")
const description = document.getElementById("description")
const type = document.getElementById("type")
const date = document.getElementById("date")
const rating = document.getElementById("rating")
const addBtn = document.getElementById("addBtn")
const updateBtn = document.getElementById("updateBtn")
const clearBtn = document.getElementById("clearBtn")
const formColumn = document.getElementById("formColumn")
const addBtnMain = document.getElementById("addBtnMain")
const formTitle = document.getElementById("formTitle")
const movieContainer = document.getElementById("movieContainer")
const body = document.getElementById("body")
const spinner = document.getElementById("spinner")
const updatedAtheading = document.getElementById("updatedAtheading")
const uiRating = document.getElementById("uiRating")

const BASE_URL = `https://gaurav-1st-db-default-rtdb.firebaseio.com/`
const MOVIE_URL = `${BASE_URL}/fetchGenericMovies.json`

let state = {
    moviesArr: [],
    edit_id: null
}

const for_Updated_At_Show = []
if (!localStorage.getItem("for_Updated_At_Show_LS")) {
    localStorage.setItem("for_Updated_At_Show_LS", JSON.stringify(for_Updated_At_Show))
}

const for_Updated_At_Show_LS = JSON.parse(localStorage.getItem("for_Updated_At_Show_LS"))

function genericApiCall(URL, methodName, methodBody) {
    methodBody = methodBody ? JSON.stringify(methodBody) : null
    return fetch(URL, {
        method: methodName,
        body: methodBody,
        headers: {
            "Content-type": "Application/json",
            "Autherization": "TOKEN FROM LS"
        }
    })
        .then(res => {
            if (!res.ok) {
                throw new Error(`HTTP Error : ${res.status}`)
            }
            return res.json()
        })

}

//============================ CREATE ====================================
function createNewMovie(eve) {
    eve.preventDefault()

    let newMovie = {
        title: title.value,
        poster: poster.value,
        description: description.value,
        type: type.value,
        rating: rating.value,
        date: date.value,
        createdAt: Date.now(),
        updatedAt: Date.now(),
    }

    showSpinner("text-success")
    genericApiCall(MOVIE_URL, "POST", newMovie)
        .then(data => {
            newMovie.id = data.name
            state.moviesArr.unshift(newMovie)

            let col = document.createElement("div")
            col.className = "col-3 mt-3"
            col.id = data.name
            col.innerHTML = `
                <div class="card movie-card">
                    <div class="card-header">
                        <div class="row" id="movie-card-header">
                            <div class="col-8">
                                <h4>${newMovie.title}</h4>
                                <p id="updatedAtheading" class="d-none ">Movie Modified At: ${new Date(newMovie.updatedAt).toLocaleDateString()} </p>
                            </div>
                            <div class="col-3 offset-1">

                                <h4 id="uiRating" class="text-center ${ratingBackground(newMovie.rating)}">${newMovie.rating}</h4>
                            </div>
                        </div>
                      
                    </div>
                    <div class="card-body">
                        <figure>
                            <img src="${newMovie.poster}"
                                alt="">
                            <figcaption>
                                <h5>${newMovie.title}</h5>
                                <p>${newMovie.description}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-between">
                            <button onClick="editMovie(this)" class="btn btn-primary">Edit</button><button onClick="deleteMovie(this)" id ="removeMovieBtn" class="btn btn-danger">Remove</button>
                        </div>
                    </div>
                </div> 
                            `


            movieContainer.prepend(col)
            

            clearForm()
            hideForm()
            showSnackBar("Added!", "Movie added successfully", "success")
        })
        .catch(err => {
            showSnackBar("Error", err, "error")
        })
        .finally(() => {
            hideSpinner("text-success")
        })

}
//============================ READ ====================================
function fetchMovies() {
    showSpinner("text-primary")
    genericApiCall(MOVIE_URL, "GET")
        .then(data => {

            for (const key in data) {
                data[key].id = key
                state.moviesArr.unshift(data[key])
                clearForm()
            }

            makingCards(state.moviesArr) // Templating function calling       
        })
        .catch(err => {
            showSnackBar("Error", err, "error")
        })
        .finally(() => {
            hideSpinner("text-primary")
        })
}
fetchMovies()

//Special templating function
function makingCards(arr) {
    let result = ""

    arr.forEach((ele) => {
        if (for_Updated_At_Show_LS.includes(ele.title)) {
            result += `
        <div class="col-3 mt-3" id=${ele.id}>
            <div class="card movie-card">
                    <div class="card-header">
                        <div class="row" id="movie-card-header">
                            <div class="col-8">
                                <h4>${ele.title}</h4>
                                <p id="updatedAtheading" class="">Movie Modified At: ${new Date(ele.updatedAt).toLocaleDateString()} </p>
                            </div>
                            <div class="col-3 offset-1">

                                <h4 id="uiRating" class="text-center  ${ratingBackground(ele.rating)}">${ele.rating}</h4>
                            </div>
                        </div>
                      
                    </div>
                    <div class="card-body">
                        <figure>
                            <img src="${ele.poster}"
                                alt="">
                            <figcaption>
                                <h5>${ele.title}</h5>
                                <p>${ele.description}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-between">
                            <button onClick="editMovie(this)" class="btn btn-primary">Edit</button><button onClick="deleteMovie(this)" id ="removeMovieBtn" class="btn btn-danger">Remove</button>
                        </div>
                </div>
            </div>
        </div>
     `
        } else {
            result += `
        <div class="col-3 mt-3" id=${ele.id}>
            <div class="card movie-card">
                    <div class="card-header">
                        <div class="row" id="movie-card-header">
                            <div class="col-8">
                                <h4>${ele.title}</h4>
                                <p id="updatedAtheading" class="d-none">Movie Modified At: ${new Date(ele.updatedAt).toLocaleDateString()} </p>
                            </div>
                            <div class="col-3 offset-1">

                                <h4 id="uiRating" class="text-center  ${ratingBackground(ele.rating)}">${ele.rating}</h4>
                            </div>
                        </div>
                      
                    </div>
                    <div class="card-body">
                        <figure>
                            <img src="${ele.poster}"
                                alt="">
                            <figcaption>
                                <h5>${ele.title}</h5>
                                <p>${ele.description}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-between">
                            <button onClick="editMovie(this)" class="btn btn-primary">Edit</button><button onClick="deleteMovie(this)" id ="removeMovieBtn" class="btn btn-danger">Remove</button>
                        </div>
                </div>
            </div>
        </div>
     `
        }
    });
    movieContainer.innerHTML = result;

}

let col8 = [...document.querySelectorAll("#movie-card-header .col-8")];

//============================ EDIT ====================================
function editMovie(ele) {
    let EDIT_ID = ele.closest(".col-3").id
    let EDIT_URL = `${BASE_URL}/fetchGenericMovies/${EDIT_ID}.json`

    showSpinner("text-success")
    genericApiCall(EDIT_URL, "GET")
        .then(data => {
            title.value = data.title
            poster.value = data.poster
            type.value = data.type
            description.value = data.description
            date.value = data.date
            rating.value = data.rating

            showForm()

            addBtnMain.disabled = true;
            ele.nextElementSibling.disabled = true

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            })

            formTitle.innerText = "Update Movie"

            state.edit_id = EDIT_ID

            addBtn.classList.add("d-none")
            updateBtn.classList.remove("d-none")
        })
        .catch(err => {
            showSnackBar("Error", err, "error")
        })
        .finally(() => {
            hideSpinner("text-success")
        })
}
//============================ UPDATE ====================================
function updateMovie(ele) {
    let UPDATE_ID = state.edit_id
    let UPDATE_URL = `${BASE_URL}/fetchGenericMovies/${UPDATE_ID}/.json`

    let updatedMovie = {
        title: title.value,
        poster: poster.value,
        description: description.value,
        type: type.value,
        rating: rating.value,
        date: date.value,
        createdAt: state.moviesArr.createdAt,
        updatedAt: Date.now(),
    }
    showSpinner("text-success")
    genericApiCall(UPDATE_URL, "PATCH", updatedMovie)
        .then(data => {
            state.edit_id = null
            let getIndex = state.moviesArr.findIndex(ele => ele.id === UPDATE_ID)
            state.moviesArr[getIndex] = updatedMovie //LSM


            document.getElementById(UPDATE_ID).innerHTML = `
                <div class="card movie-card">
                    <div class="card-header">
                        <div class="row" id="movie-card-header">
                            <div class="col-8">
                                <h4>${updatedMovie.title}</h4>
                                <p id="updatedAtheading" class="">Movie Modified At: ${new Date(updatedMovie.updatedAt).toLocaleDateString()} </p>
                            </div>
                            <div class="col-3 offset-1">

                                <h4 id="uiRating" class="text-center  ${ratingBackground(updatedMovie.rating)}">${updatedMovie.rating}</h4>
                            </div>
                        </div>
                      
                    </div>
                    <div class="card-body">
                        <figure>
                            <img src="${updatedMovie.poster}"
                                alt="">
                            <figcaption>
                                <h5>${updatedMovie.title}</h5>
                                <p>${updatedMovie.description}</p>
                            </figcaption>
                        </figure>
                    </div>
                    <div class="card-footer">
                        <div class="d-flex justify-content-between">
                            <button onClick="editMovie(this)" class="btn btn-primary">Edit</button><button onClick="deleteMovie(this)" id ="removeMovieBtn" class="btn btn-danger">Remove</button>
                        </div>
                    </div>
                </div> 
        `
            let beforeLSMTitle = state.moviesArr[getIndex].title

            for_Updated_At_Show_LS.unshift(beforeLSMTitle)
            localStorage.setItem("for_Updated_At_Show_LS", JSON.stringify(for_Updated_At_Show_LS))


            // ele.nextElementSibling.disabled = false;
            document.querySelectorAll("#removeMovieBtn").forEach(ele => ele.disabled = false) // Enabled all remove buttons

            addBtn.classList.remove("d-none")
            updateBtn.classList.add("d-none")
            addBtnMain.disabled = false;
            clearForm()
            hideForm()
            formTitle.innerText = "Add Movie"
            showSnackBar("Updated!", "Movie updated successfully", "success")
        })
        .catch(err => {
            showSnackBar("Error", err, "error")
        })
        .finally(() => {
            hideSpinner("text-success")
        })
}
//============================ DELETE ====================================
function deleteMovie(ele) {
    let DELETE_ID = ele.closest(".col-3").id
    let DELETE_URL = `${BASE_URL}/fetchGenericMovies/${DELETE_ID}.json`

    Swal.fire({
        title: "Are you sure?",
        text: "Movie removed permanently..",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            showSpinner("text-danger")
            genericApiCall(DELETE_URL, "DELETE")
                .then(data => {
                    let getIndex = state.moviesArr.findIndex(ele => ele.id === DELETE_ID)
                    state.moviesArr.splice(getIndex, 1);
                    cl(for_Updated_At_Show_LS)

                    let getIndexOfUpdatedMoviesTitles = for_Updated_At_Show_LS.findIndex(ele => ele.id === DELETE_ID)
                    for_Updated_At_Show_LS.splice(getIndexOfUpdatedMoviesTitles)
                    localStorage.setItem("for_Updated_At_Show_LS", JSON.stringify(for_Updated_At_Show_LS))

                    cl(for_Updated_At_Show_LS)

                    ele.closest(".col-3").remove()
                    showSnackBar("Removed!", "Movie removed successfully", "success")
                })
                .catch(err => {
                    showSnackBar("Error", err, "error")
                })
                .finally(() => {
                    hideSpinner("text-danger")
                })

        }
    });

}
function clearForm() {
    form.reset()
}
function hideForm() {
    formColumn.style.opacity = "0";
    formColumn.style.top = "-100vh"
    formColumn.style.transition = "0.5s linear all"
    formTitle.innerText = "Add Movie"
    addBtnMain.disabled = false;
    document.querySelectorAll("#removeMovieBtn").forEach(ele => ele.disabled = false) // Enabled all remove buttons
    updateBtn.classList.add("d-none")
    addBtn.classList.remove("d-none")
    clearForm()

    // formColumn.classList.add("d-none")

}
function showForm() {
    body.style.backgroundColor = "rgba(255,255,255,.8)"
    formColumn.style.opacity = "1";
    formColumn.style.top = "100px"
    formColumn.style.transition = "0.5s linear all"
    // formColumn.classList.remove("d-none")
}
function showSnackBar(title, msg, icon) {
    Swal.fire({
        title: title,
        text: msg,
        icon: icon
    });
}
function showSpinner(color) {
    spinner.classList.remove("d-none")
    spinner.classList.add(color)
}
function hideSpinner(color) {
    spinner.classList.add("d-none")
    spinner.classList.remove(color)
}
function ratingBackground(rating) {
    if (rating >= 8) {
        return "bg_green"
    } else if (rating >= 4) {
        return "bg_orange"
    } else {
        return "bg_red"
    }
}
form.addEventListener("submit", createNewMovie)
crossMark.addEventListener("click", hideForm)
addBtnMain.addEventListener("click", showForm)
updateBtn.addEventListener("click", updateMovie)
clearBtn.addEventListener("click", clearForm)






