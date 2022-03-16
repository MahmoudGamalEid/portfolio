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
            "\n     1-Display different categories of service providers"
            "\n     2-Display All the service providers within each category"
            "\n     3-Display a portfolio, prices and reviews for each service provider"
            "\n     4-Display different packages that the service provider offers"
            "\n     5-Display availability for each service provider"
            "\n     6-Allow user to book their desired service provider"
            "\n     7-Display all the user's booking"
            "\n     8-Allow user to chat with their desired service provider"
            "\n     9-Display the user's favorite service providers"
            "\n     10-Notify users about events on the app\n"
            "\nThe backend was implemented using firebase for:"
            "\n     1-Asset storage (firebase storage)"
            "\n     2-Database (firestore)"
            "\n     3-Authentication"
            "\n     4-Firebase functions\n"
            "\nUsing firestore queries to get live snapshots from the database and combining it with"
            "\nprovider package to create streams of the live data inside the application"
            "\nrealtime updates of the data is displayed to the user, firebase functions were used "
            "\nto send notifications to users and other functions that react to changes in the database"
            "\nservices and controllers were kept separated from UI code to keep the code maintainable"),
          "Leltk Partner App":
            Tuple2(
            "Leltk Partner application was created to allow our partners to manage their profiles, "
            "manage their bookings, chat with their customers and view useful insights about their performance on the platform in general",
            "This application works as the data population side for the customer application,"
            "\nthe following are the main features that I have implement as well:"
            "\n     1-Preview the profile of the service provider"
            "\n     2-Allow service provider to change their profile by editing their contact info, albums, packages, schedule"
            "\n     3-Allow service provider to manage their bookings "
            "\n     4-Allow service provider to chat with their customers"
            "\n     5-Allow service provider to view their insights and respond to reviews\n"
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
            "\nAt this Company I was responsible for desiging products after meeting with clients"
            "\nand creating products to solve the issues stated during our meetings"
            "\nthen pitching the product internally and addressing any feedback"
            "\n then pitching the product to the client after a successful pitch"
            "\n I would breakdown the product into features,stories and tasks in collabriation with the development team"
            "\n I would participate with the team in intial commits until the project progresses ata steady pace",
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
            "informing the ministry of realtime status of all certificates\n"
            "\nMy role in this project was:"
            "\n1-meet the clients find out their requirements "
            "\n2-Design products based on the requirements"
            "\n3-Divide the requirements into user stories with help of the team"
            "\n4-Make sure project is progressing according to deadlines"
            "\n5-Communicate any changes between client and team"
            "\n6-Communicate progress to upper management and client"
            "\n7-implement python scripts necessary for the features mentioned above"),
          "Ministry of Higher Education Certificates": Tuple2(
            "The system is intended to issue a printed diploma with a unique number and QR-code "
            "for each graduate of the educational institution, as well as to register and store information about diplomas  "
            "in databases that provide validation and detailed information about the diplomas in real time "
            "protecting against diploma forgery and eliminating the need for lengthy diploma validation processes.",
            "Project2 long description"),
          "Internal HR system":
            Tuple2("Project3 short description",
            "Project3 long description"),
          "Ministry of Foreign Affairs Internal System":
            Tuple2("Project4 short description",
            "Project4 long description")
        }),
    History(
        companyLogoPath: "/NASPS_logo.png",
        companyName:
            "National Company for Advanced Industries and Strategic Printing Solutions",
        date: "Apr 2019 - Feb 2020",
        role: "Role"
            "\nAt this Company I was responsible for designing products after meeting with clients"
            "\nand creating products to solve the issues stated during our meetings"
            "\nthen pitching the product internally and addressing any feedback"
            "\n then pitching the product to the client after a successful pitch"
            "\n I would breakdown the product into features,stories and tasks in collaboration with the development team"
            "\n I would participate with the team in initial commits until the project progresses ata steady pace",
        skills: [
          Tuple2("Project Management", 0.5),
          Tuple2("Business Development", 0.3),
        ],
        projects: {
          "Track and Trace system": Tuple2(
          "Track and Trace system is created to protect products from counterfeiting by using"
          "high-security holographic label with RFID chip to provide "
          "digital authentication and protection against reuse or duplication of labels"
          "and track the labeled products throughout the supply chain ",
          "Project1 long description"),
          "Ministry of Justice Certificates":
          Tuple2("Project2 short description",
              "Project2 long description"),
          "Ministry of Health Prescriptions":
          Tuple2("Project3 short description",
          "Project3 long description"),
          "Biometric information system": Tuple2(
          "BIS is envisioned for creation of the National "
          "Population Register where data of each individual is actualized and used by the authorized users in real time."
          "BIS is a universal instrument for the government which not only improves "
          "the quality of administrative services provided to citizens "
          "and businesses but also helps the state play a significant "
          "role in the area of world security and allows for more effective"
          " planning for economic development and faster reaction to international challenges."
          "Usage of the system begins with the birth of a child and continues "
          "throughout the life of each at different stages of life journey. "
          "The update of relevant information about each person is automated and "
          "done through the creation of a unique identification number called PIN "
          "which links personal data across all population register.",
              "Project4 long description")
        }),
    History(
        companyLogoPath: "/SC_Logo.png",
        companyName: "Streaming Creativity Game Studios",
        date: "Jan 2018 - Jan 2019",
        role: "Role"
            "\nDesign game-play mechanics and develop them using C# for Unity 3D "
            "Engine while observing S.O.L.I.D principles and utilizing Entity "
            "Component System design pattern to keep code maintainable"
            "\nDevelop back-end features for the online components of the game using "
            "Gamesparks back-end as a service utilizing javascript to write all "
            "back-end functions "
            "\nUtilize JIRA to keep track of my tasks and update my progress "
            "\nUtilize Git for version control and collaboration with the team",
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
                "\n     was implemented to translate game world coordinates to latitude and longitude."
                "\n     Also to keep track of where player units are and all actions taken on the map."
                "\n     To create this multiple local hexagonal grids were created, and one global grid was created."
                "\n     The reason behind this is one massive grid over the entire map caused severe performance issues."
                "\n     each cell in a local grid was translated into a global cell using offsets.\n"
                "\n2- Map traversal mechanics"
                "\n     Each unit the player controlled had a specific range and fuel consumption"
                "\n     The range of each unit was calculated and displayed to the user"
                "\n     The fuel consumption was also calculated and displayed to the user"
                "\n     Each unit position and movement and its validity was synced with the backend"
                "\n     All functions created in the engine were replicated on the backed for verification"
                "\n     Gamesparks was used to keep track of user unit locations\n"
                "\n3- Deploying probes on the map"
                "\n     Specific units were able to deploy different types of probes"
                "\n     These probes had different types that translated to interest points on the map"
                "\n     The grid was used to keep track of each probe fired and its coordinates"
                "\n     All probe locations were also synced with Gamesparks backend\n"
                "\n4- Fog of War"
                "\n     Fog of war is an effect obscuring parts of the map that the player did not explore yet."
                "\n     Each unit had a vision range which was used to calculate the radius where fog dissipates"
                "\n     Cleared cells were kept track of on Gamesparks to preserve player progress\n"
                "\n The above features are some of the features I helped design and implemented"),
        })
  ];
}
