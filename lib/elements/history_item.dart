import 'package:flutter_neumorphic/flutter_neumorphic.dart';
import 'package:portfolio_site/elements/skill_item.dart';
import 'package:portfolio_site/models/history.dart';

class HistoryItem extends StatefulWidget {
  final History history;

  const HistoryItem({Key? key, required this.history}) : super(key: key);

  @override
  _HistoryItemState createState() => _HistoryItemState();
}

class _HistoryItemState extends State<HistoryItem> {
  int _selectedIndex = 0;
  bool _longVersion = false;
  List<ToggleElement> createToggleElements() {
    List<ToggleElement> elements = [];
    widget.history.projects.forEach((key, value) {
      elements.add(ToggleElement(
        background: Center(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
          key,
          style: const TextStyle(fontWeight: FontWeight.w500),
        ),
            )),
        foreground: Center(
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Text(
          key,
          style: const TextStyle(fontWeight: FontWeight.w700),
        ),
            )),
      ));
    });
    return elements;
  }

  List<Widget> createProjectDescriptions() {
    List<Widget> projects = [];

    widget.history.projects.forEach((key, value) {
      Text _shortText = Text(
        value.item1,
        style: const TextStyle(height: 1.25),
      );
      Text _longText = Text(value.item2, style: const TextStyle(height: 1.25));
      projects.add(Neumorphic(
        child: Padding(
          padding: const EdgeInsets.all(8.0),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  const Padding(
                    padding: EdgeInsets.only(right: 8),
                    child: Text("Details"),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 16.0),
                    child: NeumorphicSwitch(
                      height: 25,
                      value: _longVersion,
                      isEnabled: true,
                      onChanged: (value) {
                        setState(() {
                          _longVersion = value;
                        });
                      },
                    ),
                  ),
                ],
              ),
              _longVersion ? _longText : _shortText,
            ],
          ),
        ),
      ));
    });
    return projects;
  }

  @override
  Widget build(BuildContext context) {
    List<ToggleElement> projectNames = createToggleElements();
    List<Widget> projectDescriptions = createProjectDescriptions();
    return Row(
        mainAxisAlignment: MainAxisAlignment.center,
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          Flexible(
            flex: 1,
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                ConstrainedBox(
                  constraints: const BoxConstraints(
                      maxWidth: 200,
                      maxHeight: 200,
                      minHeight: 50,
                      minWidth: 50),
                  child: Neumorphic(
                    style: const NeumorphicStyle(
                        depth: 2, intensity: 0.86, surfaceIntensity: 0.5),
                    child: Padding(
                      padding: const EdgeInsets.all(8.0),
                      child: Image.asset(
                        widget.history.companyLogoPath,
                      ),
                    ),
                  ),
                ),
                FittedBox(
                  child: Text(
                    widget.history.date,
                    style: const TextStyle(
                        fontWeight: FontWeight.w900, fontSize: 20),
                  ),
                )
              ],
            ),
          ),
          Flexible(
            flex: 6,
            child: Padding(
              padding: const EdgeInsets.all(8.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  FittedBox(
                    child: NeumorphicText(
                      widget.history.companyName,
                      textStyle: NeumorphicTextStyle(
                        fontSize: 30,
                        height: 0,
                        //fontWeight: FontWeight.w800,
                      ),
                      style: NeumorphicStyle(
                        lightSource: LightSource.topLeft,
                        depth: 1,
                        intensity: 1,
                        surfaceIntensity: 1,
                        color: Colors.grey.shade400,
                        shape: NeumorphicShape.flat,
                      ),
                    ),
                  ),
                  const SizedBox(height: 8),
                  ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 1000),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      mainAxisAlignment: MainAxisAlignment.start,
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          flex: 1,
                          child: Neumorphic(
                            style: const NeumorphicStyle(depth: -2),
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Column(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Align(
                                      alignment: Alignment.topLeft,
                                      child: FittedBox(
                                          child: Text("Skills utilized"))),
                                  ListView.builder(
                                    scrollDirection: Axis.vertical,
                                    shrinkWrap: true,
                                    itemBuilder:
                                        (BuildContext context, int index) {
                                      return SkillItem(
                                        skill: widget.history.skills[index],
                                      );
                                    },
                                    itemCount: widget.history.skills.length,
                                  )
                                ],
                              ),
                            ),
                          ),
                        ),
                        const SizedBox(width: 8),
                        Expanded(
                          flex: 4,
                          child: Neumorphic(
                            style: const NeumorphicStyle(depth: -2),
                            child: Padding(
                              padding: const EdgeInsets.all(8.0),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Text(
                                    widget.history.role,
                                    style: const TextStyle(height: 1.25),
                                  )
                                ],
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 8),
                  ConstrainedBox(
                    constraints: const BoxConstraints(maxWidth: 1000),
                    child: NeumorphicToggle(
                        onChanged: (value) {
                          setState(() {
                            _selectedIndex = value;
                          });
                        },
                        height: 50,
                        selectedIndex: _selectedIndex,
                        displayForegroundOnlyIfSelected: true,
                        thumb: Neumorphic(
                          style: NeumorphicStyle(
                              boxShape: NeumorphicBoxShape.roundRect(
                                  const BorderRadius.all(Radius.circular(12)))),
                        ),
                        children: projectNames),
                  ),
                  const SizedBox(height: 8),
                  ConstrainedBox(
                      constraints: const BoxConstraints(maxWidth: 1000),
                      child: projectDescriptions.elementAt(_selectedIndex))
                ],
              ),
            ),
          ),
        ]);
  }
}
