import 'package:flutter_neumorphic/flutter_neumorphic.dart';
import 'package:tuple/tuple.dart';

class SkillItem extends StatelessWidget {
  final Tuple2<String,double> skill;

  const SkillItem({Key? key,required this.skill}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        const SizedBox(height: 6,),
        FittedBox(child: Text(skill.item1)),
        NeumorphicProgress(
          percent: skill.item2,
          style: const ProgressStyle(depth: -2),
        ),
      ],
    );
  }
}
