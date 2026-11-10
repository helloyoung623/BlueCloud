**Add your own guidelines here**
<!--

System Guidelines

Use this file to provide the AI with rules and guidelines you want it to follow.
This template outlines a few examples of things you can add. You can add your own sections and format it to suit your needs

TIP: More context isn't always better. It can confuse the LLM. Try and add the most important rules you need

# General guidelines

Any general rules you want the AI to follow.
For example:

* Only use absolute positioning when necessary. Opt for responsive and well structured layouts that use flexbox and grid by default
* Refactor code as you go to keep code clean
* Keep file sizes small and put helper functions and components in their own files.

--------------

# Design system guidelines
Rules for how the AI should make generations look like your company's design system

Additionally, if you select a design system to use in the prompt box, you can reference
your design system's components, tokens, variables and components.
For example:

* Use a base font-size of 14px
* Date formats should always be in the format “Jun 10”
* The bottom toolbar should only ever have a maximum of 4 items
* Never use the floating action button with the bottom toolbar
* Chips should always come in sets of 3 or more
* Don't use a dropdown if there are 2 or fewer options

You can also create sub sections and add more specific details
For example:


## Button
The Button component is a fundamental interactive element in our design system, designed to trigger actions or navigate
users through the application. It provides visual feedback and clear affordances to enhance user experience.

### Usage
Buttons should be used for important actions that users need to take, such as form submissions, confirming choices,
or initiating processes. They communicate interactivity and should have clear, action-oriented labels.

### Variants
* Primary Button
  * Purpose : Used for the main action in a section or page
  * Visual Style : Bold, filled with the primary brand color
  * Usage : One primary button per section to guide users toward the most important action
* Secondary Button
  * Purpose : Used for alternative or supporting actions
  * Visual Style : Outlined with the primary color, transparent background
  * Usage : Can appear alongside a primary button for less important actions
* Tertiary Button
  * Purpose : Used for the least important actions
  * Visual Style : Text-only with no border, using primary color
  * Usage : For actions that should be available but not emphasized
-->

## Operation menus

Use `src/app/components/operation-menu.tsx` for operation-menu positioning.

* Primary menus align with the trigger's bottom-left corner and open above the
  trigger when there is not enough room below.
* Secondary menus use `submenu` and try right, left, above, then below, in that
  order. Horizontal placement has a 4px gap from the parent menu and aligns with
  the triggering row's top edge. Vertical placement has a 4px gap from the row.
* Keep menus within the viewport with 8px edge padding and scrolling when needed.
  Hover-triggered submenus must stay open while the pointer crosses the gap.

## Send button

Home, conversations, and project tasks share `ChatInput` with the same unshadowed
container and borderless add/PPT controls. Keep source selection inside the add
menu, not as a separate toolbar button.

Conversation layout uses the main content width, not the browser width, for its
560px breakpoint. Minimum main width is 320px; centered conversation width is
capped at 900px. Outer gutters are 24px above 560px and 16px otherwise; message
inner padding is 16px above 560px and zero otherwise. User messages are capped
at 85% of the conversation width and AI messages at 768px. Reserve at least
32px between toolbar actions and send; move overflowing PPT settings into More.
The input grows with text up to 328px, then scrolls.

The home project picker shows a non-interactive "暂无项目" row when empty, followed
by the separator and Create Project. Show "不选择项目" only when a valid project is
selected, and mark that project's row with the check icon. Picker rows are 44px;
the menu scrolls above 480px.

Project instruction/member dialogs are 720px wide, constrained to the viewport
with 16px margins. Instruction drafts have a 1000-character limit and are saved
only on confirmation. Member selection currently uses explicit example data;
roles are frontend metadata, not authorization. Both dialogs save to the
project's in-memory state; cancel and dismissal discard drafts.

In project tasks, the project breadcrumb is an interactive button that uses the
same project-detail navigation handler as the sidebar. Preserve the task history
when returning to the project.

## Task header actions

Active conversations show the 24px Artifacts (`2e4bf.svg`, tooltip "产物") and
More (`bbe3b.svg`) buttons at the header's right edge with an 8px gap. The More
menu uses the shared `TaskOperationsMenu`, so its pin, rename, move-to-project,
and delete actions stay identical to the sidebar task menu. Header menus and the
Artifacts panel align their right edge with the trigger.

The Artifacts panel is 256px wide with 12px padding and a 2px trigger gap. It
lists files produced by AI messages (`Message.artifacts`) in 56px rows; hovering
a row reveals Locate and Download. Locate closes the panel, scrolls to the
message's file card, and briefly highlights it. With no files, show the 200px
empty illustration and "暂无文件". Artifact data and downloads are local mocks.

AI file cards are 50px tall in a three-column grid above 560px and one column
otherwise. Small tooltips use the dark `#181818` bubble and the
`453fe.svg` arrow.

The active send button is 30px with the centered 16px white arrow asset
`public/assets/051ee.svg`. Its default, hover, and pressed backgrounds are
`#1e63f5`, `#4788ff`, and `#0e45cf`. Do not recolor the disabled arrow with CSS
filters to create the active icon.

The pause button is 30px with a centered 12px blue (`#1e63f5`) square and 2px
corner radius. Default and hover backgrounds are `#ebf4ff`; the pressed
background is `#99c3ff`.
