export const STEPS = [
    {
        id: 1,
        title: "Eligibility Check",
        question: "You want to participate in the upcoming elections. What is the primary requirement to be a voter in India?",
        hint: "Age is just a number, but for voting, it's a specific one! In India, it follows the principle of Universal Adult Suffrage.",
        options: [
            { text: "Being at least 18 years old", correct: true, feedback: "Correct! Article 326 of the Constitution defines this as the age of majority for voting." },
            { text: "Having a college degree", correct: false, feedback: "Incorrect. Education is not a requirement for voting rights in India. Every citizen is equal." },
            { text: "Paying income tax", correct: false, feedback: "Wrong. Voting is a right for every citizen, regardless of their financial status or tax contributions." },
            { text: "Owning property", correct: false, feedback: "No. India does not have property-based voting rights. One person, one vote." }
        ],
        simulation: [
            "Checking citizenship records...",
            "Verifying date of birth from official database...",
            "Validating eligibility criteria...",
            "Status: ELIGIBLE"
        ],
        recap: "You've successfully verified your eligibility. In India, any citizen aged 18 or above can participate in the democratic process."
    },
    {
        id: 2,
        title: "Registration Method",
        question: "Now that you are eligible, how will you register yourself in the electoral roll?",
        hint: "Digital India has made this very easy! You can do it right from your smartphone or the official NVSP portal.",
        options: [
            { text: "Download Voter Helpline App", correct: true, feedback: "Perfect! The ECI's mobile app is the most convenient way to register and track your application." },
            { text: "Send a WhatsApp message to the PM", correct: false, feedback: "Incorrect. Registration must be done through official ECI channels like NVSP or the Voter Helpline App." },
            { text: "Wait for a door-to-door survey", correct: false, feedback: "While periodic surveys happen, the modern way is to proactively register yourself online." },
            { text: "Visit a local police station", correct: false, feedback: "Wrong. Police stations do not handle voter registration. You should visit an ERO office or use the app." }
        ],
        simulation: [
            "Opening App Store/Play Store...",
            "Downloading Voter Helpline App (VHA)...",
            "Launching Application...",
            "Navigating to 'Voter Registration' section..."
        ],
        recap: "Great! Using the official app ensures your data goes directly to the Election Commission for processing."
    },
    {
        id: 3,
        title: "Form Selection",
        question: "You are registering for the first time. Which form should you fill out in the app?",
        hint: "Different forms serve different purposes. Look for the one specifically for 'New Voter Registration'.",
        options: [
            { text: "Form 6", correct: true, feedback: "Correct! Form 6 is the application form for the inclusion of a name in the electoral roll for a first-time voter." },
            { text: "Form 7", correct: false, feedback: "Incorrect. Form 7 is used for objecting to a name in the roll or for its deletion." },
            { text: "Form 8", correct: false, feedback: "No. Form 8 is for correction of existing entries or shifting of residence." },
            { text: "Form 6A", correct: false, feedback: "Form 6A is specifically for overseas (NRI) electors, not residents." }
        ],
        simulation: [
            "Entering Mobile Number...",
            "Verifying OTP...",
            "Selecting 'New Voter Registration'...",
            "Form 6 Interface Loaded."
        ],
        recap: "Selecting the right form is crucial. Form 6 is your gateway to becoming a registered voter."
    },
    {
        id: 4,
        title: "Document Verification",
        question: "The form asks for 'Proof of Age'. Which of these is a valid document?",
        hint: "You need a government-issued document that clearly states your date of birth. Aadhaar is a common choice today.",
        options: [
            { text: "Birth Certificate or Aadhaar Card", correct: true, feedback: "Spot on! These are standard accepted documents for age and identity proof." },
            { text: "A handwritten note from parents", correct: false, feedback: "Incorrect. Only official government-issued documents are legally valid for verification." },
            { text: "Library Membership Card", correct: false, feedback: "No. A library card is not an official government ID for age proof." },
            { text: "Electricity Bill", correct: false, feedback: "Wrong. An electricity bill is typically used as proof of residence, not age." }
        ],
        simulation: [
            "Filling personal details (Name, DOB)...",
            "Scanning Aadhaar Card...",
            "Uploading Proof of Age document...",
            "Document encrypted and saved."
        ],
        recap: "Digital documentation speeds up the verification process. Always ensure your uploads are clear and legible."
    },
    {
        id: 5,
        title: "Final Step: Voting",
        question: "It's Election Day! You are at the booth. What is the last thing you do after pressing the button on the EVM?",
        hint: "The VVPAT machine next to the EVM is there for a reason. It shows a small slip of paper for 7 seconds.",
        options: [
            { text: "Check the VVPAT slip", correct: true, feedback: "Excellent! The VVPAT allows you to verify that your vote was cast correctly for your chosen candidate." },
            { text: "Take a selfie with the machine", correct: false, feedback: "Absolutely not! Photography is strictly prohibited inside the polling booth to maintain secrecy." },
            { text: "Tell everyone who you voted for", correct: false, feedback: "No. Secrecy of the ballot is a fundamental right. Your vote is your secret." },
            { text: "Ask the officer to press it for you", correct: false, feedback: "Incorrect. You must cast your own vote to ensure its integrity and secrecy." }
        ],
        simulation: [
            "Entering the voting compartment...",
            "Pressing the blue button against the candidate...",
            "BEEP sound triggered!",
            "Verifying candidate symbol on VVPAT screen..."
        ],
        recap: "Congratulations! You have successfully navigated the journey of a voter. You've exercised your most powerful right in a democracy."
    }
];
