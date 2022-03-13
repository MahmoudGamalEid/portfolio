import 'package:tuple/tuple.dart';

class History{
  const History({
    required this.companyLogoPath,
    required this.companyName,
    required this.date,
    required this.role,
    required this.skills,
    required this.projects,
});
  final String companyLogoPath;
  final String companyName;
  final String date;
  final String role;
  final List<Tuple2<String,double>> skills;
  final Map<String,Tuple2<String,String>> projects;
}