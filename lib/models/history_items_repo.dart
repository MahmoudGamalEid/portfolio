import 'package:portfolio_site/models/history.dart';
import 'package:tuple/tuple.dart';

class HistoryItemsRepo {
  static const allHistoryItems = <History>[
    History(companyLogoPath: "/Leltk_Logo.png",
        companyName: "Leltk",
        date: "Feb 2020 - May 2021", role: "Role\n"
            "\nAt this Company I was responsible for desiging products after meeting with clients"
            "\nand creating products to solve the issues stated during our meetings"
            "\nthen pitching the product internally and addressing any feedback"
            "\n then pitching the product to the client after a successful pitch"
            "\n I would breakdown the product into features,stories and tasks in collabriation with the development team"
            "\n I would participate with the team in intial commits until the project progresses ata steady pace",
        skills: [
          Tuple2("Flutter", 0.8),
          Tuple2("Firebase", 0.3),
          Tuple2("Business Development", 0.2),
          Tuple2("Project Management", 0.1)],
        projects: {
          "Leltk Customer App":Tuple2("Project1 short description", "Project1 long description"),
          "Leltk Partner App":Tuple2("Project2 short description", "Project2 long description"),
        }),
    History(companyLogoPath: "/NASPS_logo.png",
        companyName: "National Company for Advanced Industries and Strategic Printing Solutions",
        date: "Feb 2020 - May 2021", role: "Role\n"
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
          Tuple2("C#", 0.1)],
        projects: {
          "project1":Tuple2("Project1 short description", "Project1 long description"),
          "project2":Tuple2("Project2 short description", "Project2 long description"),
          "project3":Tuple2("Project3 short description", "Project3 long description"),
          "project4":Tuple2("Project4 short description", "Project4 long description")
        }),
    History(companyLogoPath: "/NASPS_logo.png",
        companyName: "National Company for Advanced Industries and Strategic Printing Solutions",
        date: "Feb 2020 - May 2021", role: "Role\n"
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
          Tuple2("C#", 0.1)],
        projects: {
          "project1":Tuple2("Project1 short description", "Project1 long description"),
          "project2":Tuple2("Project2 short description", "Project2 long description"),
          "project3":Tuple2("Project3 short description", "Project3 long description"),
          "project4":Tuple2("Project4 short description", "Project4 long description")
        }),
    History(companyLogoPath: "/SC_Logo.png",
        companyName: "Streaming Creativity Game Studios",
        date: "Jan 2018 - Jan 2019", role: "Role\n"
            "At this Company I did 1 2 3",
        skills: [
          Tuple2("Unity 3D", 0.5),
          Tuple2("GameSparks", 0.5)],
        projects: {
          "project1":Tuple2("Project1 short description", "Project1 long description"),
          "project2":Tuple2("Project2 short description", "Project2 long description"),
          "project3":Tuple2("Project3 short description", "Project3 long description"),
          "project4":Tuple2("Project4 short description", "Project4 long description")
        })
  ];
}