# Insights
This is an idea based from Jeffery's talk about Dreams at CodeGarden 19, which will allow Umbraco to display graphs & numbers that are useful to site owners which could be extensible by Umbraco developers.

### Ideas of Insights
* Number of Exceptions/Errors
* Number of Members
* Total number of Content Nodes
* Number of Unpublished Nodes
* Number of members registered
* Number of Emails Sent - extended by developer
* Other metrics that are important to developer & or end customer

## Proposed API
Re-use the Chart.js AngularJS wrapper we use in Log Viewer
```html
<canvas chart-doughnut
  chart-data="vm.logTypeData"
  chart-labels="vm.logTypeLabels"
  chart-colors="vm.logTypeColors"
  chart-options="vm.chartOptions">
</canvas>
```

Collections that can be modified in User Composers

```csharp
// Composer code

using Umbraco.Core.Composing;
using Umbraco.Web;

namespace My.Website
{
    public class CustomInsightsComposer : IUserComposer
    {
        public void Compose(Composition composition)
        {
            composition.insights().Append<NumberOfMembers>();
            composition.insights().Append<NumberOfLockedMembers>();
        }
    }
}
```

## Proposed Interfaces
This is a common interface to all inisght types (Pie Chart, Line Chart & Number)

```csharp
interface IInsight
{
  // The alias of the section that this insight will display on
  string Section

  // The label to be displayed
  // TODO: Perhaps this is a language key & we translate that
  string Label
}
```

```csharp
interface IPieChartInsight : IInsight
{
  // See examples of JSON below for data returned
  PieChartDataModel GetData(startDate, endDate)
}
```

```csharp
interface INumbersInsight : IInsight
{
  // See examples of JSON below for data returned
  NumbersDataModel GetData(startDate, endDate)
}
```

```csharp
interface ILineChartInsight : IInsight
{
  // See examples of JSON below for data returned
  LineChartDataModel GetData(startDate, endDate)
}
```

## Models as JSON

### PieChartDataModel
```json
{
  "label": "Number of Members",
  "section": "members",
  "data": [
    {
      "label": "Male",
      "value": 12,
      "color": "#ff00ff"
    },
    {
      "label": "Female",
      "value": 24,
      "color": "#ccc000"
    }
  ]
}
```

## Proposed API responses
```csharp
GetInsights(sectionAlias, startDate, endDate)
{
  // Get items from collection where section alias match
  // For each item in the collection determine


  // If 7 days selected as range
  // then the previous 7 days to that is used for the comparisson
  // Returns a JSON array
  {
    label: "Number of Locked Members",
    total: 42,
    difference: 12
    type: postive/negative
  }
}
```

## First Goals
* Member Dashboard/section displaying graph & numbers
  * Number of Members
  * Number of Member Logins failed
  * Number of Locked Accounts
  * More...?

> Use the API that we design to create the first graphs for members as starting point, to see if it makes sense & refine it

## First UI Idea
* Each section has a new dashboard called Insights
* Displays all number insights on right in boxes takes one third of space
* Displays all chart data on a single line chart over time on left side takes two thirds of space

## Concerns/Questions
* What about long running calculations
  * Will it lock/slow down things for other requests?
  * Front end visitors
  * Other backoffice users & editors wanting to publish/etc
* Every request to a dashboard/section will re-calc these numbers & graphs
  * Will that be problematic or perf heavy?
  * Especially if community devs calc say number of emails sent from site or something potentially expensive or relaying on a 3rd party API to respond
