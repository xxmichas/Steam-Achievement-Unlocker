let greenworks = require('./greenworks')
const superfetch = require("node-superfetch")

try {
    if(greenworks.init()) {
        setTimeout(() => {
            let user = greenworks.getSteamId()
            let id = user.getRawSteamID()

            let topdiv = document.createElement("div")
            topdiv.style.paddingLeft = "10px"
            topdiv.style.marginBottom = "10px"
            topdiv.innerHTML =`Successfully initialized<br>App ID: ${greenworks.getAppId()} - <i>(getting App name)</i><br>Account: ${user.getPersonaName()}<br>${greenworks.getNumberOfAchievements().toString()} Achievements found`

            document.body.appendChild(topdiv)

            let topbuttondiv = document.createElement("div")
            topbuttondiv.className = "topbuttondiv"

            document.body.appendChild(topbuttondiv)

            let acharray = greenworks.getAchievementNames()

            let unlockall = document.createElement("button")

            let unlockarandom = document.createElement("button")

            let randomdiv = document.createElement("div")

            let randomlabel = document.createElement('label')
                let randomcheckbox = document.createElement("input")
                let randomspan = document.createElement("span")

            if (acharray.length > 1) {
                unlockall.innerHTML = "Unlock all Achievements"
                unlockall.className = "runbtn"

                unlockall.onclick = function() {
              
                    let achCollection =  document.getElementsByClassName("unlockable")
                    let achToUnlock = [...achCollection]

                    achToUnlock.forEach(xach => {
                        greenworks.activateAchievement(xach.id, s => {
                            console.log("All Achievements unlocked")
                        },
                        err => {
                            document.write(`Error getting achievement data`)
                        })
        
                        xach.className = "unlocked"
                        xach.innerHTML = `${xach.id} - Achievement already unlocked`
                    });
                }
                topbuttondiv.appendChild(unlockall)

                //----------RandomDIV----------//
                
                randomdiv.className = "randomdiv"
                randomdiv.style.display = "none"                

                document.body.appendChild(randomdiv)

                //----------Random----------//
                unlockarandom.innerHTML = "Unlock Achievements randomly"
                unlockarandom.className = "runbtn"
                
                    randomlabel.className = "randomlabel"
                    
                        randomcheckbox.type = "checkbox"
                        randomcheckbox.className = "randomcheckbox"
                        randomcheckbox.disabled = true
                        randomlabel.appendChild(randomcheckbox)
                        
                        
                        randomspan.className = "randomspan"
                        randomlabel.appendChild(randomspan)
                    
                    unlockarandom.appendChild(randomlabel)

                unlockarandom.onclick = function() {
              
                    //let achCollection =  document.getElementsByClassName("unlockable")
                    //let achToUnlock = [...achCollection]
                    randomcheckbox.checked = !randomcheckbox.checked
                    UnlockRandomly(this)
                }
                topbuttondiv.appendChild(unlockarandom)
            }

            let AchCountdown
            function UnlockRandomly() {
                console.log(randomcheckbox.checked)
                if (randomcheckbox.checked) {
                    StartCountdown()
                }
                else {
                    console.log("cancel timer")
                    clearInterval(AchCountdown)
                    randomdiv.style.display = "none"
                }
            }

            function StartCountdown() {
                let unlockableachxlist =  document.getElementsByClassName("unlockable")
                let unlockableachx = [...unlockableachxlist]

                if (unlockableachx.length > 0) {
                    if (unlockableachx.length == 1) {
                        console.log("unlock [0] achievement")
                        console.log(unlockableachx[0].id)
                        randomcheckbox.checked = false

                        randomdiv.style.display = "none"

                        greenworks.activateAchievement(unlockableachx[0].id, s => {
                            console.log("Achievement randomly unlocked")
                            },
                            err => {
                            document.write(`Error getting achievement data`)
                            })

                            unlockableachx[0].className = "unlocked"
                            unlockableachx[0].innerHTML = `${unlockableachx[0].id} - Achievement already unlocked`
                    }
                    else {
                        randomachix = unlockableachx[Math.floor(Math.random() * unlockableachx.length)]
                        console.log(unlockableachx)
                        console.log(randomachix)

                        greenworks.activateAchievement(randomachix.id, s => {
                            console.log("Achievement randomly unlocked")
                            },
                            err => {
                            document.write(`Error getting achievement data`)
                            })

                            randomachix.className = "unlocked"
                            randomachix.innerHTML = `${randomachix.id} - Achievement already unlocked`

                        //random cooldown between 3min - 7min
                        let cooldowntime = Math.floor(Math.random() * 240000) + 180000
                        console.log(cooldowntime)
                        console.log(cooldowntime / 1000)
                        console.log(cooldowntime / 60000)

                        let cooldownendtime = Date.now() + cooldowntime

                        randomdiv.innerText = ""
                        randomdiv.style.display = "block"

                        AchCountdown = setInterval(() => {
                            let cooldowntimeremaining = cooldownendtime - Date.now()

                            if (cooldowntimeremaining <= 0) {
                                randomdiv.innerText = `Next Achievement in:\n0m 0s`
                                clearInterval(AchCountdown)
                                StartCountdown()
                            }
                            else {
                                randomdiv.innerText = `Next Achievement in:\n${Math.floor((cooldowntimeremaining % (1000 * 60 * 60)) / (1000 * 60))}m ${Math.floor((cooldowntimeremaining % (1000 * 60)) / 1000)}s`
                            }
                        }, 1000);
                    }
                }
                else {
                    randomcheckbox.checked = false
                    alert("All Achievements already unlocked")
                    randomdiv.style.display = "none"
                }
            }

            GetAppName(greenworks.getAppId())

            function GetAppName(appId) {
                superfetch.get("https://store.steampowered.com/api/appdetails?appids=" + appId).then((game) => {
                    let gameInfo = JSON.parse(game.text.replace(/<br>/g, "\\n").replace(/<[^>]*>/g, ""))
                    if (gameInfo[appId].success === false) {
                        topdiv.innerHTML =`Successfully initialized<br>App ID: ${greenworks.getAppId()} - <i>(Could get App Name)</i><br>Account: ${user.getPersonaName()}<br>${greenworks.getNumberOfAchievements().toString()} Achievements found`
                    }
                    else {
                        AppTitle = gameInfo[appId].data.name
                        document.title = `${AppTitle} - Achievement Unlocker`
                        topdiv.innerHTML =`Successfully initialized<br>App ID: ${greenworks.getAppId()} - ${AppTitle}<br>Account: ${user.getPersonaName()}<br>${greenworks.getNumberOfAchievements().toString()} Achievements found`
                    }
                })
            }

            for (i = 0 ; i < acharray.length ; i++) {

                let tempach = acharray[i]
                let tempdiv = document.createElement("div")
                tempdiv.className = "loading"
                tempdiv.innerHTML = `${tempach} -&nbsp`
                tempdiv.id = tempach

                

                greenworks.getAchievement(tempach, s => {
                    if (s) {
                        tempdiv.innerHTML = tempdiv.innerHTML + (`Achievement already unlocked`)

                        tempdiv.className = "unlocked"
                    }
                    else {
                        tempbtn = document.createElement("BUTTON")
                        tempbtn.innerHTML = `Unlock Achievement`
                        tempbtn.id = tempach
                        tempbtn.className = "runbtn"

                        tempdiv.className = "unlockable"

                        tempbtn.onclick = function() {
                            greenworks.activateAchievement(this.id, s => {
                            alert("Achievement successfully unlocked");
                            },
                            err => {
                            document.write(`Error getting achievement data`)
                            })

                            this.parentElement.className = "unlocked"
                            this.parentElement.innerHTML = `${this.parentElement.id} - Achievement already unlocked`
                        }

    
                        document.getElementById(tempach).appendChild(tempbtn)
                    }
                },
                err => {
                    document.write(`Error getting achievement data`)
                })

                document.body.appendChild(tempdiv)
            }
        }, 1000);
    }
}
catch(err) {
    document.write(err.message)
}