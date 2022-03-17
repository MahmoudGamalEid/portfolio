import 'package:portfolio_site/models/history.dart';
import 'package:tuple/tuple.dart';

class HistoryItemsRepo {
  static const allHistoryItems = <History>[
    History(
        companyLogoPath: "/Leltk_Logo.png",
        companyName: "Leltk",
        date: "May 2021 - Present",
        role: "Role"
            "\nDesign Features of the both client and partner apps"
            "\nDesign Architecture of both backend and frontend components"
            "\nImplement the designed features on Flutter and Firebase"
            "\nPitch the application to possible Leltk partners",
        skills: [
          Tuple2("Flutter", 0.8),
          Tuple2("Firebase", 0.3),
          Tuple2("Business Development", 0.2),
        ],
        projects: {
          "Leltk Customer App": Tuple2(
              "Leltk is an online platform that aims to bring all event industry "
                  "service providers like event planners, videographers, photographers, makeup artists, entertainers, "
                  "to a single marketplace where users are able to choose freely and make "
                  "informed decisions on who to hire based on pricing availability and rating.",
              "The following are the main features of Leltk customer app implemented by me as a solo dev:"
                  "\n1-Display different categories of service providers"
                  "\n2-Display All the service providers within each category"
                  "\n3-Display a portfolio, prices and reviews for each service provider"
                  "\n4-Display different packages that the service provider offers"
                  "\n5-Display availability for each service provider"
                  "\n6-Allow user to book their desired service provider"
                  "\n7-Display all the user's booking"
                  "\n8-Allow user to chat with their desired service provider"
                  "\n9-Display the user's favorite service providers"
                  "\n10-Notify users about events on the app\n"
                  "\nThe backend was implemented using firebase for:"
                  "\n1-Asset storage (firebase storage)"
                  "\n2-Database (firestore)"
                  "\n3-Authentication"
                  "\n4-Firebase functions\n"
                  "\nUsing firestore queries to get live snapshots from the database and combining it with"
                  "\nprovider package to create streams of the live data inside the application"
                  "\nrealtime updates of the data is displayed to the user, firebase functions were used "
                  "\nto send notifications to users and other functions that react to changes in the database"
                  "\nservices and controllers were kept separated from UI code to keep the code maintainable"),
          "Leltk Partner App": Tuple2(
              "Leltk Partner application was created to allow our partners to manage their profiles, "
                  "manage their bookings, chat with their customers and view useful insights about their performance on the platform in general",
              "This application works as the data population side for the customer application,"
                  "\nthe following are the main features that I have implement as well:"
                  "\n1-Preview the profile of the service provider"
                  "\n2-Allow service provider to change their profile by editing their contact info, albums, packages, schedule"
                  "\n3-Allow service provider to manage their bookings "
                  "\n4-Allow service provider to chat with their customers"
                  "\n5-Allow service provider to view their insights and respond to reviews\n"
                  "\nThe architecture of this app is identical to the customer app, using snapshots and streams "
                  "\ninjected throughout the code with provider package to display the data while separating "
                  "\nservices and controllers from UI code to keep code maintainable "),
        }),
    History(
        companyLogoPath: "/NASPS_logo.png",
        companyName:
            "National Company for Advanced Industries and Strategic Printing Solutions",
        date: "Feb 2020 - May 2021",
        role: "Role"
            "\nDesigning products after meeting with clients"
            "\nCreating products to solve the issues stated during our meetings"
            "\nPitching the product internally and addressing any feedback"
            "\nPitching the product to the client after a successful pitch"
            "\nDesigning general architecture of the application"
            "\nBreaking down the product features into user stories and tasks in collaboration with the development team"
            "\nUtilize Jira to keep track of progress and reporting to upper management",
        skills: [
          Tuple2("Project Management", 0.5),
          Tuple2("Business Development", 0.3),
          Tuple2("Python", 0.2),
        ],
        projects: {
          "Ministry of Education Certificates": Tuple2(
              "The system is intended to issue a printed diploma with a unique number and QR-code "
                  "for each graduate of the educational institution, as well as to register and store information about diplomas  "
                  "in databases that provide validation and detailed information about the diplomas in real time "
                  "protecting against diploma forgery and eliminating the need for lengthy diploma validation processes.",
              "This project was divided into two stages the first one was to take existing microsoft access databases and issue certificates from them "
                  "to that end it was determined to do the following:"
                  "\n1-Convert the existing DB into MySQL database and cleanse the data"
                  "\n2-Read data in MySQL database and generate HTML pages with the designed certificate layout using Angular"
                  "\n3-Convert HTML pages into PDF files of 500 certificate each using C# .NET Core"
                  "\n4-Generate QR codes of each certificate and add it to the PDF file using C# .NET core"
                  "\n5-Generate watermark for each certificate to be printed in specialized ink for security and add it to the PDF file using python scripts"
                  "\n6-Generate PDF files with packaging instructions and labeling instructions to be attached to certificate boxes using python scripts\n"
                  "\nDue to numerous mistakes found in the existing data stage two of this project was planned to create a web application"
                  "that allows grades to be entered at different control points in the ministry, also to allow complete automation of the process"
                  "where as soon as the grades are entered the PDFs are generated automatically , fed to the printers automatically "
                  "informing the ministry of realtime status of all certificates\n"),
          "Ministry of Higher Education Certificates": Tuple2(
              "The system is intended to issue a printed diploma with a unique number and QR-code "
                  "for each graduate of the educational institution, as well as to register and store information about diplomas  "
                  "in databases that provide validation and detailed information about the diplomas in real time "
                  "protecting against diploma forgery and eliminating the need for lengthy diploma validation processes.",
              "This Project was quite similar to the Ministry of Education project in terms of the output and how it is generated "
                  "however the input was different we received different databases from each of the 20 state owned university with different formatting"
                  "so we worked on one normalized database structure that we sent to all universities and started receiving the data from them"
                  "we had to cleanse the data and made some tweaks to the Ministry of education's Certificate system to accommodate the required changes"
                  "stage 2 also had the same goals for this project so we also tweaked stage 2 project of Ministry of Education project for the changes"
                  "of The Ministry of higher education project\n"),
          "Internal HR system": Tuple2(
              "The internal HR system's purpose was to keep track of personnel's leave days in all their different types"
                  "and of their arrival and departure times and highlight to the HR department if any penalties are due"
                  "it also helped each department head and team leader keep track of off day requests and respond to them",
              "The main features in this application were:"
                  "\n1-Keep track of each employee off days credit with their different types"
                  "\n2-Allow each employee to request a vacation day from their Team lead / Department head"
                  "\n3-Allow team leads and department heads to reject or accept requests"
                  "\n4-Import the organizational chart from the existing Active directory"
                  "\n5-Show reports to upper management about leave days requested and taken"
                  "\n6-Display a calendar to each Team lead / Department head a calendar of requests and days off taken\n"
                  "\nThe project was implemented with C# .NET core for back end, Angular for frontend and MySQL for Database"
                  " and the application was containerized in docker for easy deployment\n"),
        }),
    History(
        companyLogoPath: "/NASPS_logo.png",
        companyName:
            "National Company for Advanced Industries and Strategic Printing Solutions",
        date: "Apr 2019 - Feb 2020",
        role: "Role"
            "\nUnderstanding general architecture and components of existing products designed by a partner company"
            "\nPitching the existing products to potential customers "
            "\nDesigning new products by using resources available already in existing products",
        skills: [
          Tuple2("Business Development", 0.7),
          Tuple2("Project Management", 0.3),
        ],
        projects: {
          "Track and Trace system": Tuple2(
              "Track and Trace system is created to protect products from counterfeiting by using"
                  "high-security holographic label with RFID chip to provide "
                  "digital authentication and protection against reuse or duplication of labels"
                  "and track the labeled products throughout the supply chain ",
              "I pitched this project to multiple entities:"
                  "\n1-Ministry of finance:"
                  "\nsystem was suggested to be applied to tobacco and alcohol products to avoid tax evasion and counterfeiting"
                  "\nsystem was suggested to be applied to Electric appliances by major Egyptian manufacturers to avoid tax evasion and counterfeiting"
                  "\n2-Ministry of Health"
                  "\nsystem was suggested to be applied to Medicine to avoid counterfeiting of medicine and make it easier to detect illegally imported medicine also to better control the sale of"
                  "prescription only medicine"
                  "\n3-Ministry of Artifacts and tourism"
                  "\nsystem was suggested to be applied to Egyptian artifacts in museum to better keep track of all museum inventories and track the transferal of these artifacts from one location to the other\n"
                  "\nI later used what I learned pitching these products to design the Universal prescription system to better control the sale of prescription only medicine"
                  "\nBy the time I left the Track and Trace system was launched successfully in the fields regarding the Ministry of finance "),
          "Ministry of Health Prescriptions": Tuple2(
              "This system was designed to keep track of prescriptions doctors write to their patients and the medicine those patients bought by linking the unique number"
                  "of the Medicine's control stamp suggested in the Track and Trace project to that of the Universal Prescription the doctor issued, this data can be later used to "
                  "control pharmacy inventories and detect if any illegal sales occurred",
              "This system was designed to have the factory manufacture prescriptions on security paper that cannot be forged"
                  "\n1-Each prescription would have a unique number"
                  "\n2-500 prescriptions would be packaged together and each package given a unique ID linking each individual prescription the group"
                  "\n3-Packages are delivered to doctors and personalized to them to keep track of who now possesses these prescriptions via mobile app given to couriers and doctors"
                  "\n4-Doctors would \"Activate\" each prescription via mobile app and give it to the patient"
                  "\n5-Pharmacy would have another mobile app to indicate that it did in fact receive this prescription and scan each control stamp on each medicine sold against this prescription\n"
                  "\nThis Achieved important goals:"
                  "\n1-Keep track of the number of patients a freelancer doctor(majority in Egypt) and thus be able to tax them accurately"
                  "\n2-Control the sale of medicine by pharmacies"
                  "\n3-Prevent leakage by having pharmacies control doctors and vice versa meaning a doctor cannot avoid writing the official prescription because the pharmacy won't be able to "
                  "give medicine to the patient otherwise and the pharmacy can only sell medicine that is prescribed by doctors otherwise risk penalties due to the discrepancy between "
                  "medicine prescribed and medicine sold"),
        }),
    History(
        companyLogoPath: "/SC_Logo.png",
        companyName: "Streaming Creativity Game Studios",
        date: "Jan 2018 - Jan 2019",
        role: "Role"
            "\nDesigning game-play mechanics and develop them using C# for Unity 3D "
            "Engine while observing S.O.L.I.D principles and utilizing Entity "
            "Component System design pattern to keep code maintainable"
            "\nDeveloping back-end features for the online components of the game using "
            "Gamesparks back-end as a service utilizing javascript to write all "
            "back-end functions "
            "\nUtilizing JIRA to keep track of my tasks and update my progress "
            "\nUtilizing Git for version control and collaboration with the team",
        skills: [
          Tuple2("Unity 3D", 0.5),
          Tuple2("GameSparks", 0.5)
        ],
        projects: {
          "Cerberus": Tuple2(
              "Cerberus is using game elements inspired by "
                  "the existing gaming industry to motivate her crowd of 1000s so they "
                  "help to convert satellite imagery into maps faster, more thorough "
                  "and cost effective versus experts. ",
              "In this project my role was to design and implement various features"
                  " including both the frontend and backend components. some of those features are: \n"
                  "\n1- Grid System"
                  "\nwas implemented to translate game world coordinates to latitude and longitude."
                  "\nAlso to keep track of where player units are and all actions taken on the map."
                  "\nTo create this multiple local hexagonal grids were created, and one global grid was created."
                  "\nThe reason behind this is one massive grid over the entire map caused severe performance issues."
                  "\neach cell in a local grid was translated into a global cell using offsets.\n"
                  "\n2- Map traversal mechanics"
                  "\nEach unit the player controlled had a specific range and fuel consumption"
                  "\nThe range of each unit was calculated and displayed to the user"
                  "\nThe fuel consumption was also calculated and displayed to the user"
                  "\nEach unit position and movement and its validity was synced with the backend"
                  "\nAll functions created in the engine were replicated on the backed for verification"
                  "\nGamesparks was used to keep track of user unit locations\n"
                  "\n3- Deploying probes on the map"
                  "\nSpecific units were able to deploy different types of probes"
                  "\nThese probes had different types that translated to interest points on the map"
                  "\nThe grid was used to keep track of each probe fired and its coordinates"
                  "\nAll probe locations were also synced with Gamesparks backend\n"
                  "\n4- Fog of War"
                  "\nFog of war is an effect obscuring parts of the map that the player did not explore yet."
                  "\nEach unit had a vision range which was used to calculate the radius where fog dissipates"
                  "\nCleared cells were kept track of on Gamesparks to preserve player progress\n"
                  "\nThe above features are some of the features I helped design and implemented"),
        })
  ];
}
