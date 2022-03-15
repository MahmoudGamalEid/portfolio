import 'package:flutter_neumorphic/flutter_neumorphic.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';

class AboutMe extends StatelessWidget {
  const AboutMe({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Column(children: [
      NeumorphicText(
        "Hi There",
        textStyle: NeumorphicTextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 20,
        ),
        style: const NeumorphicStyle(
            color: NeumorphicColors.defaultTextColor,
            depth: 2,
            intensity: 0.86,
            surfaceIntensity: 0.5),
      ),
      NeumorphicText(
        "I'm Mahmoud Gamal Eid",
        textStyle: NeumorphicTextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 35,
        ),
        style: const NeumorphicStyle(
            color: NeumorphicColors.defaultTextColor,
            depth: 2,
            intensity: 0.86,
            surfaceIntensity: 0.5),
      ),
      FittedBox(
        child: NeumorphicText(
          "F L U T T E R   D E V E L O P E R",
          textStyle: NeumorphicTextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 25,
          ),
          style: const NeumorphicStyle(
              color: NeumorphicColors.defaultTextColor,
              depth: 2,
              intensity: 0.86,
              surfaceIntensity: 0.5),
        ),
      ),
      Neumorphic(
        style: const NeumorphicStyle(depth: -2),
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Flexible(
                child: Padding(
                  padding: const EdgeInsets.only(left:8,),
                  child: NeumorphicButton(
                    child: const FittedBox(child: Icon(Icons.phone)),
                    onPressed: () {
                      print('phone');
                    },
                    style: const NeumorphicStyle(
                        shape: NeumorphicShape.flat,
                        boxShape: NeumorphicBoxShape.rect(),
                        depth: 2),
                  ),
                ),
              ),
              Flexible(
                child: Padding(
                  padding: const EdgeInsets.only(left: 8.0),
                  child: NeumorphicButton(
                    child: const FittedBox(child: Icon(Icons.mail)),
                    onPressed: () {
                      print('mail');
                    },
                    style: const NeumorphicStyle(
                        shape: NeumorphicShape.flat,
                        boxShape: NeumorphicBoxShape.rect(),
                        depth: 2),
                  ),
                ),
              ),
              Flexible(
                child: Padding(
                  padding: const EdgeInsets.only(left: 8.0),
                  child: NeumorphicButton(
                    child:
                        const FittedBox(child: Icon(Icons.location_on_rounded)),
                    onPressed: () {
                      print('location');
                    },
                    style: const NeumorphicStyle(
                        shape: NeumorphicShape.flat,
                        boxShape: NeumorphicBoxShape.rect(),
                        depth: 2),
                  ),
                ),
              ),
              Flexible(
                child: Padding(
                  padding:const EdgeInsets.only(left: 8.0),
                  child: NeumorphicButton(
                    child: const FittedBox(
                        child: Icon(FontAwesomeIcons.linkedinIn)),
                    onPressed: () {
                      print('linkedIn');
                    },
                    style: const NeumorphicStyle(
                        shape: NeumorphicShape.flat,
                        boxShape: NeumorphicBoxShape.rect(),
                        depth: 2),
                  ),
                ),
              ),
            ],
          ),
        ),
      )
    ]);
  }
}
