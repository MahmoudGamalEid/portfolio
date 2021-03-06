import 'package:flutter_neumorphic/flutter_neumorphic.dart';
import 'package:portfolio_site/elements/about_me.dart';
import 'package:portfolio_site/elements/history_item.dart';
import 'package:portfolio_site/models/history_items_repo.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return const NeumorphicApp(
      debugShowCheckedModeBanner: false,
      title: 'Mahmoud Eid',
      themeMode: ThemeMode.system,
      theme: NeumorphicThemeData(
        baseColor: NeumorphicColors.background,
        lightSource: LightSource.topLeft,
        defaultTextColor: NeumorphicColors.defaultTextColor,
        depth: 5,
        iconTheme: IconThemeData(color: Colors.black)
      ),
      darkTheme: NeumorphicThemeData(
        baseColor: NeumorphicColors.darkBackground,
        lightSource: LightSource.topLeft,
        defaultTextColor: NeumorphicColors.darkDefaultTextColor,
        iconTheme: IconThemeData(color: Colors.white),
        depth: 5,
        intensity: 0.4
      ),
      home: MyHomePage(),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({Key? key}) : super(key: key);

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: NeumorphicTheme.baseColor(context),
      body: SingleChildScrollView(
        child: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
              children: [
            const AboutMe(),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemBuilder: (BuildContext context, int index) {
                return HistoryItem(
                  history: HistoryItemsRepo.allHistoryItems[index],
                );
              },
              itemCount: HistoryItemsRepo.allHistoryItems.length,
            )
          ]),
        ),
      ),
    );
  }
}
