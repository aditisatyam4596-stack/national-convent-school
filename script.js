
/*
=========================================================
 NATIONAL CONVENT SCHOOL
 COMPLETE WEBSITE JAVASCRIPT
=========================================================
*/

// 1. GOOGLE APPS SCRIPT CONFIGURATION

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxWQKdc4RK4TpME1-thrmtYGat7OI8E8jjDEB7f5KyuXz3NI7qRpLYnXlYAFOiZ6cZsTw/exec";

const DEPLOYMENT_ID = "AKfycbxWQKdc4RK4TpME1-thrmtYGat7OI8E8jjDEB7f5KyuXz3NI7qRpLYnXlYAFOiZ6cZsTw";

const SPREADSHEET_ID = "1vV8ncNTKJAb1VP1fAJw579DCGr0VQE1i1raZqjFHXRuE";

const PHOTO_FOLDER_ID = "1lYwxnvATnX-ynG8XHic9iMOmAHemN9kO";

const SCHOOL_EMAIL = "";

const MAX_PHOTO_SIZE = 1 * 1024 * 1024;


// 2. WEBSITE INITIALIZATION

document.addEventListener("DOMContentLoaded", function () {

    console.log("National Convent School website initialized.");

    const navButtons = document.querySelectorAll(".nav-btn");
    const pageSections = document.querySelectorAll(".page-section");
    const goButtons = document.querySelectorAll("[data-go]");
    const emailButtons = document.querySelectorAll(
        "#emailButton, [data-email]"
    );

    const admissionForm = document.getElementById("admissionForm");
    const admissionMessage = document.getElementById("admissionMessage");

    const studentPhoto = document.getElementById("studentPhoto");
    const photoPreview = document.getElementById("photoPreview");
    const photoPlaceholder = document.getElementById("photoPlaceholder");

    const classSubjectSelect = document.getElementById("classSubjectSelect");
    const subjectsDisplay = document.getElementById("subjectsDisplay");

    let selectedPhotoData = "";
    let selectedPhotoName = "";
    let selectedPhotoType = "";


    // 3. PAGE NAVIGATION

    function showPage(pageId) {

        const targetPage = document.getElementById(pageId);

        if (!targetPage) {
            console.warn("Page not found:", pageId);
            return;
        }

        pageSections.forEach(function (section) {
            section.classList.toggle("active", section.id === pageId);
        });

        navButtons.forEach(function (button) {
            const active = button.dataset.page === pageId;

            button.classList.toggle("active", active);

            if (active) {
                button.setAttribute("aria-current", "page");
            } else {
                button.removeAttribute("aria-current");
            }
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    navButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            showPage(button.dataset.page);
        });
    });

    goButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            showPage(button.dataset.go);
        });
    });


    // 4. EMAIL / ENQUIRY BUTTONS

    function openSchoolEmail() {

        if (!SCHOOL_EMAIL.trim()) {
            alert(
                "School email configure nahi hai. " +
                "script.js mein SCHOOL_EMAIL update karein."
            );
            showPage("contact");
            return;
        }

        const subject = encodeURIComponent(
            "Enquiry - National Convent School"
        );

        const body = encodeURIComponent(
            "Respected National Convent School,\n\n" +
            "I would like to enquire about the school.\n\nThank you."
        );

        window.location.href =
            "mailto:" + SCHOOL_EMAIL +
            "?subject=" + subject +
            "&body=" + body;
    }

    emailButtons.forEach(function (button) {
        button.addEventListener("click", function (event) {
            event.preventDefault();
            openSchoolEmail();
        });
    });


    // 5. ADMISSION STATUS MESSAGE

    function showAdmissionMessage(message, type) {

        if (!admissionMessage) {
            alert(message);
            return;
        }

        admissionMessage.textContent = message;
        admissionMessage.style.display = "block";

        admissionMessage.classList.remove(
            "success", "error", "warning"
        );

        if (type) {
            admissionMessage.classList.add(type);
        }

        admissionMessage.setAttribute("role", "status");
    }


    // 6. STUDENT PHOTO PREVIEW

    function resetPhotoPreview() {

        selectedPhotoData = "";
        selectedPhotoName = "";
        selectedPhotoType = "";

        if (photoPreview) {
            photoPreview.removeAttribute("src");
            photoPreview.style.display = "none";
        }

        if (photoPlaceholder) {
            photoPlaceholder.style.display = "";
        }
    }

    if (studentPhoto) {

        studentPhoto.addEventListener("change", function () {

            const file = studentPhoto.files &&
                         studentPhoto.files[0];

            resetPhotoPreview();

            if (!file) return;

            if (!["image/jpeg", "image/png"].includes(file.type)) {
                alert("Sirf JPG ya PNG photo select karein.");
                studentPhoto.value = "";
                return;
            }

            if (file.size > MAX_PHOTO_SIZE) {
                alert("Photo ka size 1 MB se kam hona chahiye.");
                studentPhoto.value = "";
                return;
            }

            const reader = new FileReader();

            reader.onload = function (event) {

                selectedPhotoData = event.target.result;
                selectedPhotoName = file.name;
                selectedPhotoType = file.type;

                if (photoPreview) {
                    photoPreview.src = selectedPhotoData;
                    photoPreview.style.display = "block";
                }

                if (photoPlaceholder) {
                    photoPlaceholder.style.display = "none";
                }
            };

            reader.onerror = function () {
                alert("Photo read nahi ho paayi. Dobara try karein.");
                studentPhoto.value = "";
                resetPhotoPreview();
            };

            reader.readAsDataURL(file);
        });
    }


    // 7. ADMISSION FORM SUBMISSION

    function getFieldValue(id) {
        const element = document.getElementById(id);
        return element ? String(element.value || "").trim() : "";
    }

    if (admissionForm) {

        admissionForm.addEventListener("submit", async function (event) {

            event.preventDefault();

            if (!admissionForm.checkValidity()) {
                admissionForm.reportValidity();
                return;
            }

            const studentName = getFieldValue("studentName");
            const dob = getFieldValue("dob");
            const gender = getFieldValue("gender");
            const className = getFieldValue("className");
            const parentName = getFieldValue("parentName");
            const parentMobile = getFieldValue("parentMobile");
            const parentEmail = getFieldValue("parentEmail");
            const previousSchool = getFieldValue("previousSchool");
            const address = getFieldValue("address");

            if (!studentName || studentName.length > 25) {
                showAdmissionMessage(
                    "Student name bharein (maximum 25 characters).",
                    "error"
                );
                return;
            }

            if (!parentName || parentName.length > 25) {
                showAdmissionMessage(
                    "Parent ka naam sahi se bharein (maximum 25 characters).",
                    "error"
                );
                return;
            }

            if (!/^[6-9]\d{9}$/.test(parentMobile)) {
                showAdmissionMessage(
                    "Valid 10-digit Indian mobile number dalein.",
                    "error"
                );
                return;
            }

            if (
                parentEmail &&
                !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(parentEmail)
            ) {
                showAdmissionMessage(
                    "Valid email address dalein.",
                    "error"
                );
                return;
            }

            if (dob) {
                const selectedDate = new Date(dob + "T00:00:00");
                const today = new Date();
                today.setHours(23, 59, 59, 999);

                if (
                    Number.isNaN(selectedDate.getTime()) ||
                    selectedDate > today
                ) {
                    showAdmissionMessage(
                        "Valid Date of Birth select karein.",
                        "error"
                    );
                    return;
                }
            }

            if (
                studentPhoto &&
                studentPhoto.required &&
                !selectedPhotoData
            ) {
                showAdmissionMessage(
                    "Student ki photo select karein.",
                    "error"
                );
                return;
            }

            if (
                !SCRIPT_URL.startsWith("https://script.google.com/") ||
                !SCRIPT_URL.endsWith("/exec")
            ) {
                showAdmissionMessage(
                    "Web App URL galat hai. SCRIPT_URL check karein.",
                    "error"
                );
                return;
            }

            const submitButton = admissionForm.querySelector(
                'button[type="submit"], input[type="submit"]'
            );

            const originalText = submitButton
                ? (submitButton.tagName === "INPUT"
                    ? submitButton.value
                    : submitButton.textContent)
                : "";

            if (submitButton) {
                submitButton.disabled = true;

                if (submitButton.tagName === "INPUT") {
                    submitButton.value = "Submitting...";
                } else {
                    submitButton.textContent = "Submitting...";
                }
            }

            showAdmissionMessage(
                "Admission request bheji ja rahi hai...",
                "warning"
            );

            const payload = {
                studentName: studentName,
                dob: dob,
                gender: gender,
                className: className,
                parentName: parentName,
                parentMobile: parentMobile,
                parentEmail: parentEmail,
                previousSchool: previousSchool,
                address: address,
                photoData: selectedPhotoData,
                photoName: selectedPhotoName,
                photoMimeType: selectedPhotoType,
                submittedAt: new Date().toISOString()
            };

            try {

                /*
                 * NOTE:
                 * Is payload ke field names Code.gs ke doPost()
                 * ke saath match hone chahiye.
                 */

                await fetch(SCRIPT_URL, {
                    method: "POST",
                    mode: "no-cors",
                    headers: {
                        "Content-Type": "text/plain;charset=utf-8"
                    },
                    body: JSON.stringify(payload)
                });

                showAdmissionMessage(
                    "Request bhej di gayi hai. Google Spreadsheet " +
                    "mein record check karke submission confirm karein.",
                    "success"
                );

                admissionForm.reset();
                resetPhotoPreview();

            } catch (error) {

                console.error("Admission form error:", error);

                showAdmissionMessage(
                    "Request bhejne mein problem hui. Internet aur " +
                    "Web App deployment check karein.",
                    "error"
                );

            } finally {

                if (submitButton) {
                    submitButton.disabled = false;

                    if (submitButton.tagName === "INPUT") {
                        submitButton.value = originalText;
                    } else {
                        submitButton.textContent = originalText;
                    }
                }
            }
        });
    }


    // 8. CLASS-WISE SUBJECTS

    const classSubjects = {
        "Nursery": [
            "English", "Hindi", "Maths", "Drawing", "Rhymes"
        ],
        "LKG": [
            "English", "Hindi", "Maths", "Drawing", "Rhymes"
        ],
        "UKG": [
            "English", "Hindi", "Maths", "EVS", "Drawing"
        ],
        "Class 1": [
            "English", "Hindi", "Mathematics", "EVS", "Computer"
        ],
        "Class 2": [
            "English", "Hindi", "Mathematics", "EVS", "Computer"
        ],
        "Class 3": [
            "English", "Hindi", "Mathematics", "EVS", "Computer"
        ],
        "Class 4": [
            "English", "Hindi", "Mathematics", "EVS", "Computer"
        ],
        "Class 5": [
            "English", "Hindi", "Mathematics", "EVS", "Computer"
        ],
        "Class 6": [
            "English", "Hindi", "Mathematics", "Science",
            "Social Science", "Sanskrit", "Computer"
        ],
        "Class 7": [
            "English", "Hindi", "Mathematics", "Science",
            "Social Science", "Sanskrit", "Computer"
        ],
        "Class 8": [
            "English", "Hindi", "Mathematics", "Science",
            "Social Science", "Sanskrit", "Computer"
        ]
    };

    function renderSubjects() {

        if (!classSubjectSelect || !subjectsDisplay) return;

        const selectedClass = classSubjectSelect.value;
        const subjects = classSubjects[selectedClass];

        subjectsDisplay.replaceChildren();

        if (!subjects) {
            subjectsDisplay.textContent =
                "Subjects dekhne ke liye class select karein.";
            return;
        }

        const heading = document.createElement("h3");
        heading.textContent = selectedClass + " - Subjects";
        subjectsDisplay.appendChild(heading);

        const list = document.createElement("ul");

        subjects.forEach(function (subject) {
            const item = document.createElement("li");
            item.textContent = subject;
            list.appendChild(item);
        });

        subjectsDisplay.appendChild(list);
    }

    if (classSubjectSelect && subjectsDisplay) {
        classSubjectSelect.addEventListener("change", renderSubjects);

        if (classSubjectSelect.value) {
            renderSubjects();
        }
    }


    // 9. AUTOMATIC FOOTER YEAR

    const yearElement = document.getElementById("year");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    // 10. START WEBSITE

    showPage("home");

    console.log("Navigation buttons:", navButtons.length);
    console.log("Page sections:", pageSections.length);
    console.log("Admission form found:", Boolean(admissionForm));
    console.log("Deployment configured:", Boolean(DEPLOYMENT_ID));

});
