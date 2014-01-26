require 'spec_helper'

describe "Mondrian" do
  include Capybara::DSL

  before { visit "index.html" }

  context "initial rendering" do
    it "should start with the instruction dialogs" do
      expect(page).to have_content("Click any of the numbers")
      expect(page).to have_content("Click and drag inside the")
    end
  end

  context "functionality", js: true do
    it "should be able to close the instruction dialogs" do
      first_dialog = page.all(:css, ".topbar").first
      first_dialog.click

      expect(page).to have_no_content("Click any of the numbers")
    end

    it "should be able to close the instruction dialogs" do
      second_dialog = page.all(:css, ".topbar").last
      second_dialog.click
      expect(page).to have_no_content("Click and drag inside the")
    end

    it "should be able to click and drag" do
      first = page.find("*[data-id='[0,0]']")
      second = page.find("*[data-id='[9,9]']")

      first.drag_to(second)

      expect(page.all(:css, ".selected").count).to eq(100)
    end

    it "should be able to select a color after clicking and dragging" do
      first = page.find("*[data-id='[0,0]']")
      second = page.find("*[data-id='[9,9]']")

      first.drag_to(second)

      yellow = page.find(".yellow")
      yellow.click

      # 101 instead of 100 because the palette has the same class.
      expect(page.all(:css, ".yellow").count).to eq(101)
    end

    it "should be able to clear the canvas" do
      first = page.find("*[data-id='[0,0]']")
      second = page.find("*[data-id='[9,9]']")

      first.drag_to(second)

      yellow = page.find(".yellow")
      yellow.click

      clear = page.find("#clear")
      clear.click

      expect(page.all(:css, ".yellow").count).to eq(1)
    end
  end
end