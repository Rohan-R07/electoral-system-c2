export const STEP_POOL = [
    {
        id: 1,
        title: "Eligibility Check",
        questionSets: [
            {
                question: "You want to participate in the upcoming elections. What is the primary requirement to be a voter in India?",
                hint: "Age is just a number, but for voting, it's a specific one! It follows the principle of Universal Adult Suffrage.",
                options: [
                    { text: "Being at least 18 years old", correct: true, feedback: "Correct! Article 326 of the Constitution defines this as the age of majority for voting." },
                    { text: "Having a college degree", correct: false, feedback: "Incorrect. Education is not a requirement for voting rights in India." },
                    { text: "Paying income tax", correct: false, feedback: "Wrong. Voting is a right for every citizen, regardless of their financial status." }
                ],
                simulation: [
                    { text: "Verifying citizenship records...", sub: "Cross-referencing with national database." },
                    { text: "Checking date of birth...", sub: "Calculating age from official records." },
                    { text: "Validation Successful", sub: "Status: ELIGIBLE" }
                ],
                recap: "You've successfully verified your eligibility. In India, any citizen aged 18 or above can participate."
            },
            {
                question: "You reached the polling booth but your name is not on the list. Which criteria should you have checked earlier?",
                hint: "Eligibility is more than just age; you must be present on the 'Electoral Roll'.",
                options: [
                    { text: "Inclusion in the Electoral Roll", correct: true, feedback: "Exactly! You must be registered in the electoral roll of your constituency." },
                    { text: "Your social media follower count", correct: false, feedback: "Wrong. Digital popularity has no impact on voting rights." },
                    { text: "The color of your ink", correct: false, feedback: "No. Ink is applied AFTER you are verified on the list." }
                ],
                simulation: [
                    { text: "Searching Electoral Roll...", sub: "Querying EPIC database for your name." },
                    { text: "Entry Found: Ward 12", sub: "Name is correctly listed in the constituency." },
                    { text: "✅ Enrollment Confirmed", sub: "You are ready to proceed." }
                ],
                recap: "Being 18 is the first step, but being on the list (Electoral Roll) is what grants you the actual vote."
            }
        ]
    },
    {
        id: 2,
        title: "Registration Method",
        questionSets: [
            {
                question: "How will you register yourself in the electoral roll in the modern 'Digital India' era?",
                hint: "Digital India has made this very easy from your smartphone!",
                options: [
                    { text: "Voter Helpline App", correct: true, feedback: "Perfect! The ECI's mobile app is the most convenient way to register." },
                    { text: "Post a letter to the Prime Minister", correct: false, feedback: "Incorrect. Registration must be done through official ECI channels." },
                    { text: "Visit a local police station", correct: false, feedback: "Wrong. Police stations do not handle voter registration." }
                ],
                simulation: [
                    { text: "Downloading Voter Helpline App...", sub: "Fetching official app from Store." },
                    { text: "Launching Application...", sub: "Initializing secure registration module." },
                    { text: "✅ App Ready", sub: "Proceeding to registration portal." }
                ],
                recap: "Using the official app ensures your data goes directly to the Election Commission for processing."
            },
            {
                question: "If you don't have a smartphone, where can you go physically to register as a voter?",
                hint: "There is a specific officer in every constituency in charge of the rolls.",
                options: [
                    { text: "Office of the ERO", correct: true, feedback: "Correct! The Electoral Registration Officer (ERO) handles physical applications." },
                    { text: "The nearest Post Office", correct: false, feedback: "Not quite. While they have forms sometimes, they don't process them." },
                    { text: "The local grocery store", correct: false, feedback: "No. Only official government offices handle voter rolls." }
                ],
                simulation: [
                    { text: "Navigating to ERO Office...", sub: "Locating the nearest government administrative building." },
                    { text: "Meeting Booth Level Officer...", sub: "Inquiring about physical Form 6 availability." },
                    { text: "✅ Location Reached", sub: "Starting physical application process." }
                ],
                recap: "Whether online or offline, the ECI provides multiple paths to ensure no citizen is left behind."
            }
        ]
    },
    {
        id: 3,
        title: "Form Selection",
        questionSets: [
            {
                question: "You are registering for the first time. Which form should you fill out?",
                hint: "Look for the primary form for 'New Voter Registration'.",
                options: [
                    { text: "Form 6", correct: true, feedback: "Correct! Form 6 is for first-time voter registration." },
                    { text: "Form 7", correct: false, feedback: "Incorrect. Form 7 is for deletion or objection of names." },
                    { text: "Form 8", correct: false, feedback: "No. Form 8 is for correction of existing entries." }
                ],
                simulation: [
                    { text: "Opening Form 6...", sub: "Loading first-time registration form." },
                    { text: "Verifying Mobile Number...", sub: "Sending secure OTP." },
                    { text: "✅ Initialized", sub: "Ready for data entry." }
                ],
                recap: "Selecting the right form is crucial. Form 6 is your gateway to becoming a registered voter."
            },
            {
                question: "You have moved to a new city and need to transfer your vote. Which form is used for correction or shifting?",
                hint: "This form is for when you are ALREADY a voter but your details need to change.",
                options: [
                    { text: "Form 8", correct: true, feedback: "Exactly! Form 8 is used for shifting of residence or correction of particulars." },
                    { text: "Form 6", correct: false, feedback: "No. Form 6 is only for brand new voters." },
                    { text: "Form 10", correct: false, feedback: "Wrong. Form 10 is not related to voter registration." }
                ],
                simulation: [
                    { text: "Opening Form 8...", sub: "Accessing correction and shifting module." },
                    { text: "Searching existing EPIC ID...", sub: "Locating your old voter records." },
                    { text: "✅ Records Found", sub: "Updating address to current constituency." }
                ],
                recap: "Maintaining an accurate address in the roll ensures you can vote at the booth nearest to your home."
            }
        ]
    },
    {
        id: 4,
        title: "Document Verification",
        questionSets: [
            {
                question: "Which of these is a valid 'Proof of Age' for registration?",
                hint: "You need a government-issued document that clearly states your date of birth.",
                options: [
                    { text: "Birth Certificate or Aadhaar", correct: true, feedback: "Spot on! These are standard accepted documents for age proof." },
                    { text: "Library Membership Card", correct: false, feedback: "No. A library card is not an official government ID for age proof." },
                    { text: "School Playground Pass", correct: false, feedback: "Wrong. This has no legal standing for age verification." }
                ],
                simulation: [
                    { text: "Scanning Identity Card...", sub: "Extracting DOB information." },
                    { text: "Uploading to Server...", sub: "Securely storing document." },
                    { text: "✅ Verified", sub: "Age criteria satisfied." }
                ],
                recap: "Digital documentation speeds up the verification process. Always ensure your uploads are clear."
            }
        ]
    },
    {
        id: 5,
        title: "Final Step: Voting",
        questionSets: [
            {
                question: "What is the last thing you do after pressing the EVM button?",
                hint: "The VVPAT machine next to the EVM is there for a reason.",
                options: [
                    { text: "Check the VVPAT slip", correct: true, feedback: "Excellent! The VVPAT allows you to verify that your vote was cast correctly." },
                    { text: "Take a selfie with the machine", correct: false, feedback: "Absolutely not! Photography is strictly prohibited." },
                    { text: "Ask the officer who to vote for", correct: false, feedback: "No. It is your private choice." }
                ],
                simulation: [
                    { text: "Pressing EVM Button...", sub: "Recording vote for candidate." },
                    { text: "Verifying VVPAT Screen...", sub: "Confirming symbol on paper slip." },
                    { text: "✅ Vote Casted", sub: "Participation complete." }
                ],
                recap: "Congratulations! You have successfully exercised your most powerful right in a democracy."
            }
        ]
    }
];
