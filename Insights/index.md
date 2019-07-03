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
// Composer code...

composition.insights().AddGraph<NumberOfMembers>()
composition.insights().AddNumber<NumberOfLockedMembers>();
```

## Proposed Interfaces
```csharp
interface INumberInsight
{
  // The alias of the section that this graph will display on
  string Section

  // The label to be displayed
  // TODO: Perhaps this is a language key & we translate that
  string Label

  // The main method/entry point to fetch/calculate the number
  // Returns an object with difference & 
  // if positive or negative difference
  GetNumber(startDate, endDate)
}
```

## Proposed API responses
```csharp
GetNumberInsights(sectionAlias, startDate, endDate)
{
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
