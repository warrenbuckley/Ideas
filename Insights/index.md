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

### NumbersDataModel
```json
{
  "label": "Logs",
  "section": "settings",
  "data": [
    {
      "label": "Info",
      "value": 2034,
      "difference": 5,
      "diffColor": "Green",
      "diffArrow": "Up"
    },
    {
      "label": "Error",
      "value": 3000,
      "difference": 24,
      "diffColor": "Red",
      "diffArrow": "Up"
    }
  ]
}
```
**NOTE**: The `difference` property, should it be a static number or be a percentage difference?

**NOTE**: `diffColor` is an enum (Red, Green, Neutral) and arrow seperate properties, as for the error example above having the number of errors go up is deemed bad/red where if the number was to go down then it would be green.


## Proposed API response
```csharp
GetInsights(sectionAlias, startDate, endDate)
{
  // Get items from collection where section alias match
  // For each item in the collection determine

  // Call each item in collection GetData() method
  // This API call then will return a collection of insights
  
  // We can iterate over this client side & display a pie, line or number collection
  // in a grid formatation

}
```

## Database Storage
This will need to have some new database tables added in order so we can track & persist numbers for items, as this will allow us to keep historical data over a time period & help with perf as rather than calculating metrics every time we want to view the dashboard, we are able to fetch the numbers from a database.

There will be two approaches to adding data:
* Every time a member is created we would to listen to the Member created event in Umbraco & increase the count
* Alternatively a member may not be created on a given day & we would need to schedule a time to run a method to calculate the total of members available at 00:01 every day & use `SetValue`

Thinking about the above scenario, would depend if we are calculating the total number of members every single day OR if we are plotting on a line chart or using the numbers insight to show how many new members are added every day.

```csharp
// Adding a bulk value
insightService.AddValue(10, "aliasToInsight");

// Removing a bulk value
insightService.RemoveValue(4, "aliasToInsight");

// Setting a specific value (may want to override already set value)
insightService.SetValue(52, "aliasToInsight");

// Adding member count by one - shorthand of AddValue(1, "aliasToInsight")
insightService.Add("aliasToInsight");

// Decrease count by one - shorthand of RemoveValue(1, "aliasToInsight")
insightService.Remove("aliasToInsight");
```

### Database tables

**umbracoInsightMetric**

Column Name | Data Store
------------ | -------------
Id | Int
Metric | String

Id | Metric
------------ | -------------
1 | numberOfMembers
2 | numberOfErrors

**umbracoInsightData**

Column Name | Data Store
------------ | -------------
DateMeasured | Date
Value | Int
MetricId | Int (Key to other table)

DateMeasured | Value | MetricId
------------ | ------------- | -------------
2019-07-03 | 42 | 1
2019-07-03 | 5 | 2
2019-07-04 | 0 | 1
2019-07-04 | 545 | 2

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
