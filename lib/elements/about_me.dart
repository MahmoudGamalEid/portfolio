import 'package:flutter_neumorphic/flutter_neumorphic.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:url_launcher/url_launcher.dart';

class AboutMe extends StatefulWidget {
  const AboutMe({Key? key}) : super(key: key);

  @override
  State<AboutMe> createState() => _AboutMeState();
}

class _AboutMeState extends State<AboutMe> {
  final String linkedInUrl =
      "https://www.linkedin.com/in/mahmoud-gamal-a0067592/";

  final String phoneNUmber = "tel:+201117475548";

  final String location = "Cairo, Egypt";

  final String email =
      "mailto:mahmoudgamaleid@gmail.com?subject=Professional Opportunity&body=Hello Mahmoud,\n";
  String _details = "Hello";
  bool _showDetails = false;
  @override
  Widget build(BuildContext context) {
    return Column(children: [
      NeumorphicText(
        "Hi There",
        textStyle: NeumorphicTextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 20,
        ),
        style: NeumorphicStyle(
            color: NeumorphicTheme.currentTheme(context).defaultTextColor,
            intensity: 0.5,
            surfaceIntensity: 0.5),
      ),
      NeumorphicText(
        "I'm Mahmoud Gamal Eid",
        textStyle: NeumorphicTextStyle(
          fontWeight: FontWeight.bold,
          fontSize: 35,
        ),
        style: NeumorphicStyle(
            color: NeumorphicTheme.currentTheme(context).defaultTextColor,
            intensity: 0.5,
            surfaceIntensity: 0.5),
      ),
      FittedBox(
        child: NeumorphicText(
          "F L U T T E R   D E V E L O P E R",
          textStyle: NeumorphicTextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 25,
          ),
          style: NeumorphicStyle(
              color: NeumorphicTheme.currentTheme(context).defaultTextColor,
              lightSource: LightSource.topLeft,
              intensity: 0.5,
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
                  padding: const EdgeInsets.only(
                    left: 8,
                  ),
                  child: NeumorphicButton(
                    child: const FittedBox(child: Icon(Icons.phone)),
                    onPressed: () async {
                      if (MediaQuery.of(context).size.width <= 425) {
                        await launch(phoneNUmber);
                      }
                      setState(() {
                        _showDetails = true;
                        _details = phoneNUmber.split(":")[1];
                      });
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
                    onPressed: () async {
                      await launch(email);
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
                      setState(() {
                        _showDetails = true;
                        _details = location;
                      });
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
                    child: const FittedBox(
                        child: Icon(FontAwesomeIcons.linkedinIn)),
                    onPressed: () async {
                      await launch(linkedInUrl);
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
      ),
      Visibility(visible: _showDetails, child: SelectableText(_details)),
    ]);
  }
}
